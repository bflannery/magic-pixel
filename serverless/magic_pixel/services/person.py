import re
from typing import Dict, Optional

from sqlalchemy import or_
from magic_pixel import logger
from magic_pixel.constants import EventFormTypeEnum
from magic_pixel.db import db
from magic_pixel.utility import is_valid_email, is_valid_uuid
from magic_pixel.models.person import Person, Fingerprint

login_hints = ["login", "signin" "enter"]

sign_up_hints = ["signup", "join", "enroll", "register", "subscribe", "create"]

first_name_hints = ["firstname", "fname"]
last_name_hints = ["lastname", "lname"]
name_hints = ["name"]
email_hints = ["lastname", "lname"]

form_hints = (
    login_hints + sign_up_hints + first_name_hints + last_name_hints + email_hints
)

# "form": {
#     "formId": "545a0ef6-4324-c37f-cf7b-9b97b9ebf865",
#     "formFields": {
#         "fname": "Testy",
#         "lname": "McTester",
#         "email": "bflannery66@gmail.com",
#         "anonymous": "Sign up"
#     }
# },


def strip_form_field(keyword: str) -> str:
    pattern = re.compile("[\W_]")
    return re.sub(pattern, "", keyword).lower()


def check_for_key(keys, hints):
    for key in keys:
        for hint in hints:
            has_key = re.search(hint, key)
            if has_key:
                return key
    return None


def build_form_field_map(form_fields_keys, form_fields):
    email_key = check_for_key(form_fields_keys, ["email"])
    first_name_key = check_for_key(form_fields_keys, first_name_hints)
    last_name_key = check_for_key(form_fields_keys, last_name_hints)
    # login_key = check_for_key(form_fields_keys, login_hints)
    # signup_key = check_for_key(form_fields_keys, login_hints)

    return {
        "email": form_fields.get(email_key),
        "first_name": form_fields.get(first_name_key),
        "last_name": form_fields.get(last_name_key),
        # "login_key": login_key,
        # "signup_key": signup_key,
    }


def update_person_fields():
    pass


def identify_person_on_login_form(account_id, email):
    person_by_email = Person.query.filter_by(email).first()
    # If a person created a new account on the host site before implementing MP, we may not have the
    # person yet, in this case create a new one
    if not person_by_email:
        person_by_email = Person(account_id=account_id, email=email).save()
    person_by_email.save()
    return person_by_email


def identify_person_on_signup_form(account_id, form_field_map):
    person = Person(
        account_id=account_id,
        email=form_field_map["email"],
        first_name=form_field_map["first_name"],
        last_name=form_field_map["last_name"],
    ).save()
    return person


def identify_form_type(event):
    form = event.get("form")
    form_id = is_valid_uuid(form["formId"])

    # Check for the form id
    if form_id:
        # Check for the form id is a UUID
        form_id_is_uuid = is_valid_uuid(form_id)

        # If form id is not UUID, check id against login/signup hints
        if not form_id_is_uuid:
            stripped_form_id = strip_form_field(form_id)
            is_login_form = check_for_key([stripped_form_id], login_hints)
            if is_login_form:
                return EventFormTypeEnum.LOGIN

            is_signup_form = check_for_key([stripped_form_id], sign_up_hints)
            if is_signup_form:
                return EventFormTypeEnum.SIGN_UP

        # If not id, what route are we on?

    # Does the route include distinction between login/signup?
    pass


def identify_person_on_form_submit(account_id, fingerprint, event):
    try:
        form = event.get("form")
        form_fields = form.get("formFields")
        form_fields_keys = form_fields.keys()
        form_field_map = build_form_field_map(form_fields_keys, form_fields)

        form_type = identify_form_type(event)

        form_person = None

        # Try to get email from form field values
        if (
            form_field_map["login_key"]
            or form_field_map["signup_key"]
            and form_field_map["email"] is None
        ):
            form_fields_values = form_fields.values()
            email_value = list(filter(lambda x: is_valid_email(x)), form_fields_values)
            if email_value:
                form_field_map["email"] = email_value[0]

        # If login form, try to find person by email
        if form_field_map["login_key"] and form_field_map["email"]:
            form_person = identify_person_on_login_form(
                account_id, form_field_map["email"]
            )

        # if signup form, create a new person with available form fields
        if form_field_map["signup_key"] and form_field_map["email"]:
            if not (form_field_map["first_name"] or form_field_map["last_name"]):
                name = check_for_key(form_fields_keys, name_hints)
                if name:
                    form_field_map["first_name"] = name
            form_person = identify_person_on_signup_form(account_id, form_field_map)

        # If login/signup are false, look for unnamed fields values for hints
        if not form_field_map["login_key"] and not form_field_map["signup_key"]:
            anon_fields = form_fields["anonymous"]
            for anon_field in anon_fields:
                anon_form_key_value = strip_form_field(anon_field)
                for sign_up_hint in sign_up_hints:
                    is_signup_key = re.search(sign_up_hint, anon_form_key_value)
                    if is_signup_key:
                        form_person = identify_person_on_signup_form(
                            account_id, form_field_map
                        )

                for login_hint in login_hints:
                    is_login_form = re.search(login_hint, anon_form_key_value)
                    if is_login_form:
                        form_person = identify_person_on_login_form(
                            account_id, form_field_map["email"]
                        )

        # Check if person has fingerprints and if this is an existing fingerprint on the person
        if form_person and form_person.fingerprints:
            person_fingerprints = [f.value for f in form_person.fingerprints]
            if fingerprint not in person_fingerprints:
                Fingerprint(person=form_person, value=fingerprint).save()
        else:
            Fingerprint(person=form_person, value=fingerprint).save()

    except Exception as e:
        logger.log_exception(e)
        raise Exception


def identify_event_person(account_id: int, event: dict):
    person_id = event.get("personId")
    event_type = event.get("event")
    fingerprint = event.get("fingerprint")

    # Look up person by id
    if person_id:
        person = Person.query.filter_by(id=person_id).first()
        if not person:
            raise Exception(f"No person found with id {person_id}")
        if fingerprint not in person.fingerprints:
            Fingerprint(person=person, value=fingerprint).save()
            db.session.commit()
        return person

    # Lookup person by fingerprint
    person_by_fingerprint = (
        Person.query.join(Fingerprint).filter(Fingerprint.value == fingerprint).first()
    )

    if person_by_fingerprint and event_type != "formsubmit":
        return person_by_fingerprint

    # Lookup/Create person from form fields
    elif not person_by_fingerprint and event_type == "formsubmit":
        person = identify_person_on_form_submit(account_id, fingerprint, event)
        db.session.commit()
        return person
    else:
        # We have no idea who you are, create a new person and fingerprint
        person = Person(account_id=account_id).save()
        Fingerprint(person=person).save()

    db.session.commit()
    return person

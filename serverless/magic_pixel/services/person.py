import re

from sqlalchemy import or_
from magic_pixel import logger
from magic_pixel.db import db
from magic_pixel.utility import is_valid_email
from magic_pixel.models.person import Person


login_hints = ["login", "signin" "enter"]

sign_up_hints = ["signup", "join", "enroll", "register", "subscribe"]

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


def strip_form_fields(keyword: str) -> str:
    pattern = re.compile("[\W_]")
    return re.sub(pattern, "", keyword).lower()


def check_for_key(keys, hints):
    for key in keys:
        for hint in hints:
            has_key = re.search(hint, key)
            if has_key:
                return key
    return False


def build_form_field_map(form_fields_keys, form_fields):
    email_key = check_for_key(form_fields_keys, ["email"])
    first_name_key = check_for_key(form_fields_keys, first_name_hints)
    last_name_key = check_for_key(form_fields_keys, last_name_hints)

    return {
        "email": form_fields[email_key] if email_key else None,
        "first_name": form_fields[first_name_key] if first_name_key else None,
        "last_name": form_fields[last_name_key] if last_name_key else None,
    }


def identify_person_on_form_submit(account_id, event: dict):
    try:
        fingerprint = event["fingerprint"]
        form = event.get("form")
        form_fields = form.get("formFields")
        form_fields_keys = form_fields.keys()
        is_login_form = False
        is_signup_form = False

        form_field_map = build_form_field_map(form_fields_keys, form_fields)

        login_key = check_for_key(form_fields_keys, login_hints)
        signup_key = check_for_key(form_fields_keys, sign_up_hints)

        # Try to get email from form field values
        if login_key or signup_key and form_field_map["email"] is None:
            form_fields_values = form_fields.values()
            email_value = list(filter(lambda x: is_valid_email(x)), form_fields_values)
            if email_value:
                form_field_map["email"] = email_value[0]

        # If login form, try to find person by email
        if login_key and form_field_map["email"]:
            email = form_field_map["email"]
            person = Person.query.filter_by(email).first()
            # If a person created a new account on the host site before implementing MP, we may not have the
            # person yet, in this case create a new one
            if not person:
                person = Person(
                    account_id=account_id, email=email, fingerprint=fingerprint
                ).save()
            person.save()
            return person

        # if signup form, create a new person with available form fields
        if signup_key and form_field_map["email"]:
            if not (form_field_map["first_name"] or form_field_map["last_name"]):
                name = (check_for_key(form_fields_keys, name_hints),)
                if name:
                    form_field_map["first_name"] = name
            person = Person(
                account_id=account_id,
                email=form_field_map["email"],
                first_name=form_field_map["first_name"],
                last_name=form_field_map["last_name"],
                fingerprint=fingerprint,
            ).save()
            return person

        # If login/signup are false, look for unnamed fields values for hints:
        if not login_key and not signup_key:
            anon_fields = form_fields["anonymous"]
            for anon_field in anon_fields:
                anon_form_key_value = strip_form_fields(anon_field)
                for sign_up_hint in sign_up_hints:
                    is_signup_key = re.search(sign_up_hint, anon_form_key_value)
                    if is_signup_key:
                        person = Person(
                            account_id=account_id,
                            email=form_field_map["email"],
                            first_name=form_field_map["first_name"],
                            last_name=form_field_map["last_name"],
                            fingerprint=fingerprint,
                        ).save()
                        return person

                for login_hint in login_hints:
                    is_login_form = re.search(login_hint, anon_form_key_value)
                    if is_login_form:
                        email = form_field_map["email"]
                        person = Person.query.filter_by(email).first()
                        # Should have a person by this point but just in case, create a new person
                        if not person:
                            person = Person(
                                account_id=account_id,
                                email=email,
                                fingerprint=fingerprint,
                            ).save()
                        person.save()
                        return person

        # If this is a login/signup field, and there was no "email" key,
        # Check the value fields for email like string
        if is_login_form or is_signup_form and form_field_map["email"] is None:
            form_fields_values = form_fields.values()
            email_value = list(filter(lambda x: is_valid_email(x)), form_fields_values)
            if email_value:
                form_field_map["email"] = email_value[0]
        return {}
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def identify_event_person(account_id: int, event: dict):
    event_type = event.get("event")
    if event_type == "formsubmit":
        person = identify_person_on_form_submit(account_id, event)
        db.session.commit()
        return person

    user_id = event.get("userId")
    fingerprint = event.get("fingerprint")

    person = Person.query.filter(
        Person.account_id == account_id,
        or_(Person.id == user_id, Person.fingerprint == fingerprint),
    ).first()
    if not person:
        person = Person(account_id=account_id, fingerprint=fingerprint).save()
    db.session.commit()
    return person


# # Search through form keys to determine if the form is login/signup
# # and/or has person attributes
# for form_field_key in form_fields_keys:
#     form_key = strip_form_fields(form_field_key)
#     for sign_up_hint in sign_up_hints:
#         is_signup_key = search(sign_up_hint, form_key)
#         if is_signup_key:
#             is_signup_form = True
#     for login_hint in login_hints:
#         is_login_form = search(login_hint, form_key)
#         if is_login_form:
#             is_login_form = True
#     for first_name_hint in first_name_hints:
#         is_first_name_key = search(first_name_hint, form_key)
#         if is_first_name_key:
#             form_field_map["first_name"] = form_fields[form_field_key]
#     for last_name_hint in last_name_hints:
#         is_last_name_key = search(last_name_hint, form_key)
#         if is_last_name_key:
#             form_field_map["last_name"] = form_fields[form_field_key]
#     is_email_key = search("email", form_key)
#     if is_email_key:
#         form_field_map["email"] = form_fields[form_field_key]

import re
from sqlalchemy import or_

from server import logger
from server.constants import EventFormTypeEnum, AttributeTypeEnum
from server.db import db
from server.models import EventForm, Event, Person, Alias
from server.utility import is_valid_email, is_valid_uuid

LOGIN_HINTS = ["login", "signin" "enter"]
SIGN_UP_HINTS = ["signup", "join", "enroll", "register", "subscribe", "create"]
FIRST_NAME_HINTS = ["firstname", "fname"]
LAST_NAME_HINTS = ["lastname", "lname"]
NAME_HINTS = ["name"]
EMAIL_HINTS = ["lastname", "lname"]
FORM_HINTS = (
    LOGIN_HINTS + SIGN_UP_HINTS + FIRST_NAME_HINTS + LAST_NAME_HINTS + EMAIL_HINTS
)


def parse_event_form(event_form: dict) -> dict:
    event_form_fields = event_form["formFields"]
    event_form_id = event_form["formId"]

    # Check for the form id is a UUID
    form_id_is_uuid = is_valid_uuid(event_form_id)
    form_type = None
    # If form id is not UUID, check id against login/signup hints
    if not form_id_is_uuid:
        # Try to find out what time of form this is
        form_type = identify_form_type(event_form_id, event_form_fields)

    return {
        "form_id": event_form_id,
        "form_fields": event_form_fields,
        "form_type": form_type,
    }


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


def get_form_type(form_key):
    stripped_form_key = strip_form_field(form_key)
    is_login_form = check_for_key([stripped_form_key], LOGIN_HINTS)
    if is_login_form:
        return EventFormTypeEnum.LOGIN
    is_signup_form = check_for_key([stripped_form_key], SIGN_UP_HINTS)
    if is_signup_form:
        return EventFormTypeEnum.SIGN_UP
    return None


# def get_email_from_form(form_fields):
#     for form_field_key, form_field_value in form_fields.items():
#         if form_field_key == "anonymous":
#             anon_values = form_field_value  # Anonymous key can be an array of strings
#             if len(anon_values):
#                 for anon_value in anon_values:
#                     if is_valid_email(anon_value):
#                         return anon_value
#             return None
#         else:
#             email_key = check_for_key([form_field_key], ["email"])
#             if not email_key:
#                 # Check if field value is an email
#                 email_value = (
#                     form_field_value if is_valid_email(form_field_value) else None
#                 )
#                 if email_value:
#                     return email_value
#             else:
#                 return form_fields[email_key]


def build_form_field_map(form_fields):
    try:
        form_fields_keys = form_fields.keys()
        form_type_field_map = {}

        for form_field_key, form_field_value in form_fields.items():
            if form_field_key == "anonymous":
                anon_values = (
                    form_field_value  # Anonymous key can be an array of strings
                )
                if len(anon_values):
                    if not form_type_field_map.get(AttributeTypeEnum.EMAIL):
                        # Search for email key in form fields
                        email_key = check_for_key(anon_values, ["email"])
                        if not email_key:
                            # Check if field value is an email
                            email_value = None
                            for anon_value in anon_values:
                                if is_valid_email(anon_value):
                                    email_value = anon_value
                            if email_value:
                                form_type_field_map[AttributeTypeEnum.EMAIL] = email_key
                        else:
                            form_type_field_map[AttributeTypeEnum.EMAIL] = email_key
                else:
                    form_type_field_map[AttributeTypeEnum.TEXT] = form_field_key
            else:
                if not form_type_field_map.get(AttributeTypeEnum.EMAIL):
                    # Search for email key in form fields
                    email_key = check_for_key([form_field_key], ["email"])
                    if not email_key:
                        # Check if field value is an email
                        email_value = (
                            form_field_value
                            if is_valid_email(form_field_value)
                            else None
                        )
                        if email_value:
                            form_type_field_map[AttributeTypeEnum.EMAIL] = email_key
                    else:
                        form_type_field_map[AttributeTypeEnum.EMAIL] = email_key

                if not form_type_field_map.get(AttributeTypeEnum.FIRST_NAME):
                    first_name_key = check_for_key(form_fields_keys, FIRST_NAME_HINTS)
                    if first_name_key:
                        form_type_field_map[
                            AttributeTypeEnum.FIRST_NAME
                        ] = first_name_key

                if not form_type_field_map.get(AttributeTypeEnum.LAST_NAME):
                    last_name_key = check_for_key(form_fields_keys, LAST_NAME_HINTS)
                    if last_name_key:
                        form_type_field_map[AttributeTypeEnum.LAST_NAME] = last_name_key

                if not form_type_field_map.get(
                    AttributeTypeEnum.FIRST_NAME
                ) or form_type_field_map.get(AttributeTypeEnum.LAST_NAME):
                    name = check_for_key(form_fields_keys, NAME_HINTS)
                    if name:
                        form_type_field_map[AttributeTypeEnum.FIRST_NAME] = name

            is_known_type = form_field_key in form_type_field_map.values()
            if not is_known_type:
                form_type_field_map[AttributeTypeEnum.TEXT] = form_field_key
        return form_type_field_map
    except Exception as e:
        print(e)
        raise e


def identify_form_type_by_scraping_values(anon_fields):
    for anon_field in anon_fields:
        form_type = get_form_type(anon_field)
        if form_type:
            return form_type


def identify_form_type(form_id, form_fields):
    # Try to get type by form id
    form_type = get_form_type(form_id)
    if not form_type:
        anon_fields = form_fields.get("anonymous")
        if anon_fields:
            form_type = identify_form_type_by_scraping_values(anon_fields)
        # TODO: scrape route
    return form_type


# TODO: Needs to be re-worked. Was implemented before visitor/person/alias relationships
def ingest_form_event(account_id, parsed_event, event_form):
    try:
        parsed_event_form = parse_event_form(event_form)
        event_forms_fields = parsed_event_form["form_fields"]
        visitor_id = parsed_event["visitor_id"]

        form_fields_map = build_form_field_map(event_forms_fields)
        # Check if form has an email field to try and identify person
        email_form_key = form_fields_map.get(AttributeTypeEnum.EMAIL)
        form_email_value = event_forms_fields.get(email_form_key)

        # Check if visitor alias exists or person exists by email
        event_person = Person.query.filter(
            Person.account_id == account_id,
            or_(
                Person.distinct_id == visitor_id,
                Person.email == form_email_value,
            ),
        ).first()

        if not event_person:
            # Check if form has an email field to try and identify person
            if email_form_key:
                is_sign_up = parsed_event_form["form_type"] == EventFormTypeEnum.SIGN_UP
                # Check if form type is sign up or login
                if is_sign_up:
                    # Create new person
                    event_person = Person(
                        account_id=account_id,
                        distinct_id=visitor_id,
                        email=form_email_value,
                    ).save()
                    # Check if the event person distinct id and visitor id are not equal
                    Alias(person=event_person, original_distinct_id=visitor_id).save()

        # Create new event
        new_event = Event(
            created_at=parsed_event["created_at"],
            account_id=account_id,
            account_site_id=parsed_event["account_site_id"],
            visitor_id=parsed_event["visitor_id"],
            person=event_person,
            session_id=parsed_event["session_id"],
            fingerprint=parsed_event["fingerprint"],
            type=parsed_event["type"],
        ).save()

        # Create new event form
        EventForm(
            event=new_event,
            form_id=parsed_event_form["form_id"],
            form_type=parsed_event_form["form_type"],
            form_fields=parsed_event_form["form_fields"],
        ).save()

        db.session.commit()
        return True
    except Exception as e:
        raise

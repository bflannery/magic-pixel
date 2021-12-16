import json
import re

from magic_pixel import logger
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum
from magic_pixel.db import db
from magic_pixel.models import EventForm, Attribute, Event
from magic_pixel.services import person, event
from magic_pixel.utility import is_valid_email, is_valid_uuid

LOGIN_HINTS = ["login", "signin" "enter"]
SIGN_UP_HINTS = ["signup", "join", "enroll", "register", "subscribe", "create"]
FIRST_NAME_HINTS = ["firstname", "fname"]
LAST_NAME_HINTS = ["lastname", "lname"]
NAME_HINTS = ["name"]
EMAIL_HINTS = ["lastname", "lname"]
FORM_HINTS = (
    LOGIN_HINTS + SIGN_UP_HINTS + FIRST_NAME_HINTS + LAST_NAME_HINTS + EMAIL_HINTS
)


def parse_event_form(event_id: str, event_form: dict) -> dict:
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
        "event_id": event_id,
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


def get_email_from_form(form_fields):
    for form_field_key, form_field_value in form_fields.items():
        if form_field_key == "anonymous":
            anon_values = form_field_value  # Anonymous key can be an array of strings
            if len(anon_values):
                for anon_value in anon_values:
                    if is_valid_email(anon_value):
                        return anon_value
            return None
        else:
            email_key = check_for_key([form_field_key], ["email"])
            if not email_key:
                # Check if field value is an email
                email_value = (
                    form_field_value if is_valid_email(form_field_value) else None
                )
                if email_value:
                    return email_value
            else:
                return form_fields[email_key]


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


def save_event_form(event_form: dict) -> dict:
    logger.log_info(f"save_event_form: {event_form}")
    try:
        event_form = EventForm(
            event_id=event_form["event_id"],
            form_id=event_form["form_id"],
            form_type=event_form["form_type"],
            form_fields=event_form["form_fields"],
        ).save()
        db.session.commit()
        return event_form
    except Exception as e:
        logger.log_exception(e)
        raise e


def ingest_event_form(account_id, person_id, event_id, original_event):
    try:
        parsed_event_form = parse_event_form(event_id, original_event["form"])
        # Check for event form
        event_form = EventForm.query.filter_by(form_id=parsed_event_form["form_id"]).first()
        if not event_form:
            # Create new one
            event_form = save_event_form(parsed_event_form)

        form_fields_map = build_form_field_map(parsed_event_form["form_fields"])
        forms_fields = parsed_event_form["form_fields"]

        # Save account person and form attributes
        person.save_account_person_attributes(
            account_id, person_id, event_form.id, forms_fields, form_fields_map
        )

        # Save the remaining the event details
        event.ingest_event_details(original_event, event_id)
        return True
    except Exception as e:
        logger.log_exception(e)
        raise e



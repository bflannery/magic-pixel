import re

from magic_pixel import logger
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum, EventTypeEnum
from magic_pixel.db import db
from magic_pixel.utility import is_valid_email, is_valid_uuid
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute

LOGIN_HINTS = ["login", "signin" "enter"]
SIGN_UP_HINTS = ["signup", "join", "enroll", "register", "subscribe", "create"]
FIRST_NAME_HINTS = ["firstname", "fname"]
LAST_NAME_HINTS = ["lastname", "lname"]
NAME_HINTS = ["name"]
EMAIL_HINTS = ["lastname", "lname"]
FORM_HINTS = (
    LOGIN_HINTS + SIGN_UP_HINTS + FIRST_NAME_HINTS + LAST_NAME_HINTS + EMAIL_HINTS
)


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


def get_form_type(form_id):
    stripped_form_id = strip_form_field(form_id)
    is_login_form = check_for_key([stripped_form_id], LOGIN_HINTS)
    if is_login_form:
        return EventFormTypeEnum.LOGIN
    is_signup_form = check_for_key([stripped_form_id], SIGN_UP_HINTS)
    if is_signup_form:
        return EventFormTypeEnum.SIGN_UP
    return None


def build_form_field_map(account_id, form_fields):
    try:
        form_fields_keys = form_fields.keys()
        form_type_field_map = {}
        attribute_map = {}

        for form_field_key in form_fields_keys:
            form_field_value = form_fields[form_field_key]
            # Check if field key attribute exists
            account_attribute = Attribute.query.filter_by(
                account_id=account_id, name=form_field_key
            ).first()
            if account_attribute:
                form_type_field_map[account_attribute.type]: form_field_key
                attribute_map[account_attribute.id] = {
                    "type": account_attribute.type,
                    "name": account_attribute.name,
                }

            if form_field_key == "anonymous":
                anon_values = (
                    form_field_value  # Anonymous key can be an array of strings
                )
                if len(anon_values):
                    if not form_type_field_map.get(AttributeTypeEnum.EMAIL):
                        # Search for email key in form fields
                        email_key = check_for_key([anon_values], ["email"])
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
                    else:
                        form_type_field_map[AttributeTypeEnum.TEXT] = anon_values
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

        form_type_field_map_keys = form_type_field_map.keys()
        for form_type_field_map_key in form_type_field_map_keys:
            attribute_type = form_type_field_map_key
            attribute_name = form_type_field_map[form_type_field_map_key]
            new_attribute = Attribute(
                account_id=account_id,
                type=attribute_type,
                name=attribute_name,
            ).save()
            db.session.commit()
            attribute_map[new_attribute.id] = {
                "type": new_attribute.type,
                "name": new_attribute.name,
            }
        return attribute_map
    except Exception as e:
        print(e)
        return e


def identify_form_type_by_id(form_id):
    # Check for the form id is a UUID
    form_id_is_uuid = is_valid_uuid(form_id)

    # If form id is not UUID, check id against login/signup hints
    if not form_id_is_uuid:
        return get_form_type(form_id)
    return None


def identify_form_type_by_route(source, form_id):
    source_url = source.get("url")
    if not source_url:
        logger.log_warning("No source url to identify form by route")
        return None
    pathname = source_url.get("pathname")
    if not pathname:
        logger.log_warning("No pathname on url to identify form by route")
        return None
    # Does the route include distinction between login/signup?
    form_type = get_form_type(form_id)
    return form_type


def identify_form_type_by_scraping_values(anon_fields):
    for anon_field in anon_fields:
        form_type = get_form_type(anon_field)
        if form_type:
            return form_type


def identify_form_type(form):
    form_id = is_valid_uuid(form["formId"])
    form_type = None
    # Check for the form id
    if form_id:
        # Try to get type by form id
        form_type = identify_form_type_by_id(form_id)
        if not form_type:
            # If not by route, try scraping th form values for button text
            form_fields = form["formFields"]
            anon_fields = form_fields.get("anonymous")
            if anon_fields:
                form_type = identify_form_type_by_scraping_values(anon_fields)
    return form_type


def update_person_attributes_on_form_event(account_id, person_id, form_fields):
    person_attributes = PersonAttribute.query.filter_by(person_id=person_id).all()
    form_field_attribute_map = build_form_field_map(account_id, form_fields)
    for person_attribute in person_attributes:
        form_field_attribute = form_field_attribute_map[person_attribute.attribute_id]
        form_field_value = form_fields[form_field_attribute["name"]]
        if form_field_value != person_attribute.value:
            person_attribute.value = form_field_value
            person_attribute.save()
    db.session.commit()
    return person_attributes


def identify_new_person_on_form_event(account_id, event_form, fingerprint):
    event_form_fields = event_form.get("formFields")
    form_person = None
    if event_form_fields:
        attribute_map = build_form_field_map(account_id, event_form_fields)
        form_email = None
        for attribute_key, attribute in attribute_map.items():
            if attribute["type"] == AttributeTypeEnum.EMAIL:
                form_email = event_form_fields[attribute["name"]]
                break

        if form_email:
            form_person = (
                Person.query.join(PersonAttribute)
                .filter(
                    Person.account_id == account_id, PersonAttribute.value == form_email
                )
                .first()
            )
            # If no person by email, create a new account person
            if not form_person:
                form_person = Person(account_id=account_id).save()
                db.session.commit()
            # Check if fingerprint exists on the person
            if fingerprint not in form_person.fingerprints:
                Fingerprint(person_id=form_person.id, value=fingerprint).save()

        if form_person:
            for attribute_key, attribute in attribute_map.items():
                person_attribute = PersonAttribute.query.filter_by(
                    person_id=form_person.id, attribute_id=attribute_key
                ).first()
                if not person_attribute:
                    person_attribute = PersonAttribute(
                        person_id=form_person.id, attribute_id=attribute_key
                    ).save()

                event_form_key = attribute["name"]
                person_attribute.value = event_form_fields[event_form_key]
    db.session.commit()
    return form_person


def identify_event_person(account_id: int, event: dict):
    person_id = event.get("personId")
    event_type = event.get("event")
    event_fingerprint = event.get("fingerprint")

    # Look up person by id
    if person_id:
        person = Person.query.filter_by(id=person_id).first()
        if not person:
            raise Exception(f"No person found with id {person_id}")
        # Check if fingerprint exists already on the person, if not create a new one
        if event_fingerprint not in person.fingerprints:
            Fingerprint(person=person, value=event_fingerprint).save()
            db.session.commit()
        return person

    # Lookup person by fingerprint
    person_by_fingerprint = (
        Person.query.join(Fingerprint)
        .filter(Fingerprint.value == event_fingerprint)
        .first()
    )

    # If person by fingerprint and not form event, nothing to update, return person
    if person_by_fingerprint:
        if event_type != EventTypeEnum.FORM_SUBMIT:
            return person_by_fingerprint

    elif event_type == EventTypeEnum.FORM_SUBMIT.value:
        event_form = event["form"]
        # If no person by fingerprint and is form event, parse form for person and person attributes
        if not person_by_fingerprint:
            form_person = identify_new_person_on_form_event(
                account_id, event["form"], event_fingerprint
            )
            return form_person
        else:
            # Update person attributes
            updated_person = update_person_attributes_on_form_event(
                account_id, event_form["formFields"], person_by_fingerprint
            )
            return updated_person
    else:
        # We have no idea who you are, create a new person and fingerprint
        person = Person(account_id=account_id).save()
        Fingerprint(person=person).save()
        db.session.commit()
        return person

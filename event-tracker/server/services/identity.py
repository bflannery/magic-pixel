from server import logger
from server.constants import AttributeTypeEnum
from server.db import db
from server.lib.aws_sqs import event_identity_queue
from server.models import Visitor, VisitorPerson, Person, PersonAlias, Alias
from server.services.event import parse_event
from server.services.event_form import build_form_field_map


def identify_visitor(parsed_event):
    visitor_uuid = parsed_event.get("visitor_uuid")
    fingerprint = parsed_event.get("fingerprint")
    event_browser = parsed_event.get("browser")
    event_locale = parsed_event.get("locale")
    account_site_id = parsed_event.get("account_site_id")
    visitor = Visitor.query.filter_by(visitor_uuid=visitor_uuid).first()
    if not visitor:
        Visitor(
            account_site_id=account_site_id,
            visitor_uuid=visitor_uuid,
            fingerprint=fingerprint,
            browser_name=event_browser["browser_name"],
            plugins=event_browser["plugins"],
            ua=event_browser["ua"],
            version=event_browser["version"],
            screen_cd=event_browser["screen_cd"],
            screen_height=event_browser["screen_height"],
            screen_width=event_browser["screen_width"],
            language=event_locale["language"],
            tz_offset=event_locale["tz_offset"],
        ).save()
    return visitor


def identify_person(account_site_id, distinct_person_id):
    person = Person.query.filter_by(
        account_site_id=account_site_id, distinct_person_id=distinct_person_id
    ).first()
    if not person:
        person = Person(
            account_site_id=account_site_id, distinct_person_id=distinct_person_id
        ).save()
    return person


def enrich_person(
    person,
    event_form,
):
    event_forms_fields = event_form.get("form_fields")
    form_fields_map = build_form_field_map(event_forms_fields)

    email_form_key = form_fields_map.get(AttributeTypeEnum.EMAIL)
    person.email = event_forms_fields.get(email_form_key)

    fist_name_form_key = form_fields_map.get(AttributeTypeEnum.FIRST_NAME)
    person_first_name = event_forms_fields.get(fist_name_form_key)

    last_name_form_key = form_fields_map.get(AttributeTypeEnum.LAST_NAME)
    person_last_name = event_forms_fields.get(last_name_form_key)

    person.fullname = f"{person_first_name} {person_last_name}"

    person.save()
    return person


def identify_visitor_person(account_site_id: str, visitor: Visitor, person: Person):
    visitor_person = VisitorPerson.query.filter_by(
        account_site_id=account_site_id, visitor=visitor, person=person
    ).first()
    if not visitor_person:
        VisitorPerson(
            account_site_id=account_site_id,
            visitor=visitor,
            person=person,
            confidence=100.00,
        ).save()
    return visitor_person


def identify_person_alias(account_site_id: str, person: Person, alias: Alias):
    visitor_person = PersonAlias.query.filter_by(
        account_site_id=account_site_id, alias=alias, person=person
    ).first()
    if not visitor_person:
        PersonAlias(
            account_site_id=account_site_id,
            alias=alias,
            person=person,
            confidence=100.00,
        ).save()
    return visitor_person


def identify_alias(distinct_person_id: str, visitor_uuid: str):
    alias = Alias.query.filter_by(
        distinct_person_id=distinct_person_id,
        visitor_uuid=visitor_uuid,
    ).first()
    if not alias:
        alias = Alias(
            distinct_person_id=distinct_person_id,
            visitor_uuid=visitor_uuid,
        ).save()
    return alias


def ingest_event_identity_message(event) -> bool:
    logger.log_info(f"ingest identity message: {event}")
    try:
        # Parse event
        parsed_event = parse_event(event)
        event_form = parsed_event.get("form")
        account_site_id = parsed_event.get("account_site_id")
        distinct_person_id = parsed_event.get("distinct_person_id")
        visitor_uuid = parsed_event.get("visitor_uuid")

        # Do we know who this visitor is?
        visitor = identify_visitor(parsed_event)

        # Does the event have a distinct person id?
        if distinct_person_id:
            # If so, do we know who this person is?
            person = identify_person(account_site_id, distinct_person_id)

            # Is this a form event?
            if event_form:
                person = enrich_person(person, event_form)

            # Does this visitor_person exist?
            visitor_person = identify_visitor_person(account_site_id, visitor, person)

            # Do we need an alias?
            alias = identify_alias(distinct_person_id, visitor_uuid)

            # Does this person_alias exist?
            person_alias = identify_person_alias(account_site_id, person, alias)

        if not distinct_person_id and parsed_event.get("form"):
            # TODO: Add form scraping
            pass

        db.session.commit()
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


def queue_event_identity_service(event: dict) -> bool:
    return event_identity_queue.send_message(event)

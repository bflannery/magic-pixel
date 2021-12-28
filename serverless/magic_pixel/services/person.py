from magic_pixel import logger
from magic_pixel.constants import AttributeTypeEnum
from magic_pixel.db import db
from magic_pixel.models import Account
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute


def get_person_by_email(account_id, email):
    return Person.query.filter_by(account_id=account_id, email=email).first()


def save_account_person_attributes(
    account_id, person, event_form_id, form_fields, form_type_field_map
):
    #   form_type_field_map = {
    #       <AttributeTypeEnum.FIRST_NAME: 'first_name'>: 'gzdy-fname',
    #       <AttributeTypeEnum.LAST_NAME: 'last_name'>: 'customer[lname]',
    #       <AttributeTypeEnum.EMAIL: 'email'>: 'gx7zy-email',
    #       <AttributeTypeEnum.TEXT: 'text'>: 'anonymous'
    #   }
    try:
        for form_field_key, form_field_value in form_type_field_map.items():
            person_attribute_value = form_fields[form_field_value]
            # If form has email, and not the same as current, save it to the person
            if form_field_key == AttributeTypeEnum.EMAIL:
                if person.email != person_attribute_value:
                    person.email = person_attribute_value
                    person.save()

            # Check if field key attribute exists
            account_attribute = Attribute.query.filter(
                Attribute.account_id == account_id,
                Attribute.event_form_id == event_form_id,
                Attribute.type != AttributeTypeEnum.TEXT,
                Attribute.type == form_field_key,
            ).first()

            if not account_attribute or form_field_key == AttributeTypeEnum.TEXT:
                account_attribute = Attribute(
                    account_id=account_id,
                    event_form_id=event_form_id,
                    type=form_field_key,
                    name=form_field_value,
                ).save()
            PersonAttribute(
                person_id=person.id,
                attribute=account_attribute,
                value=person_attribute_value,
            ).save()
            db.session.commit()
        return True
    except Exception as e:
        raise e


def identify_person(account_id, distinct_user_id, event_fingerprint):
    confidence = 0

    # Lookup person by user_id
    event_person = Person.query.filter_by(distinct_id=distinct_user_id).first()

    if not event_person:
        # We have no idea who you are, create a new person and fingerprint
        event_person = Person(account_id=account_id).save()
        confidence = 100

    # TODO: Add Confidence Score Logic with fingerprint

    return (event_person, confidence)


def identify_person_og(account_id, event_fingerprint):
    # Lookup person by fingerprint
    event_person = (
        Person.query.join(Fingerprint, Fingerprint.person_id == Person.id)
        .join(Account, Account.id == Person.account_id)
        .filter(
            Fingerprint.value == event_fingerprint,
            Account.id == account_id,
        )
        .first()
    )

    if not event_person:
        # We have no idea who you are, create a new person and fingerprint
        event_person = Person(account_id=account_id).save()
        Fingerprint(person=event_person, value=event_fingerprint).save()
    else:
        person_fingerprints = (
            [fp.value for fp in event_person.fingerprints]
            if event_person.fingerprints
            else None
        )
        if person_fingerprints and event_fingerprint not in person_fingerprints:
            Fingerprint(person_id=event_person.id, value=event_fingerprint).save()
    db.session.commit()
    return event_person

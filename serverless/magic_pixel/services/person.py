from magic_pixel.constants import AttributeTypeEnum
from magic_pixel.db import db
from magic_pixel.models import Account
from magic_pixel.models.account import AccountSite
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute


def get_person_by_fingerprint(fingerprint):
    return (
        Person.query.join(Fingerprint).filter(Fingerprint.value == fingerprint).first()
    )


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
            # Check if field key attribute exists
            account_attribute = Attribute.query.filter(
                Attribute.account_id == account_id,
                Attribute.event_form_id == event_form_id,
                Attribute.type != AttributeTypeEnum.TEXT,
            ).first()

            if form_field_key == AttributeTypeEnum.TEXT or not account_attribute:
                account_attribute = Attribute(
                    account_id=account_id,
                    event_form_id=event_form_id,
                    type=form_field_key,
                    name=form_field_value,
                ).save()

            # person_email_attribute = PersonAttribute.query.filter(PersonAttribute.value ==)
            form_email = form_fields[form_field_value]

            person_by_email = Person.query.join(PersonAttribute).filter(
                Person.account_id == account_id,
                PersonAttribute.attribute_id == account_attribute.id,
                PersonAttribute.email == form_email,
            )

            person_attribute_value = form_fields[form_field_value]
            PersonAttribute(
                person_id=person.id,
                attribute=account_attribute,
                value=person_attribute_value,
            ).save()
            db.session.commit()
        return True
    except Exception as e:
        raise e


def identify_person_on_event(account_id, site_id, event_fingerprint, person_id=None):
    # Look up person by id
    if person_id:
        person = Person.get_by_mp_id(person_id)
        if not person:
            raise Exception(f"No person found with id {person_id}")
        # Check if fingerprint exists already on the person, if not create a new one
        person_fingerprints = (
            [p.value for p in person.fingerprints] if person.fingerprints else None
        )
        if event_fingerprint not in person_fingerprints:
            Fingerprint(person=person, value=event_fingerprint).save()
            db.session.commit()
        return person
    # Lookup person by fingerprint
    form_person = (
        Person.query.join(Fingerprint, Fingerprint.person_id == Person.id)
        .join(Account, Account.id == Person.account_id)
        .filter(
            Fingerprint.value == event_fingerprint,
            Account.id == account_id,
            AccountSite.id == site_id,
        )
        .first()
    )

    if not form_person:
        # We have no idea who you are, create a new person and fingerprint
        form_person = Person(account_id=account_id).save()
        Fingerprint(person=form_person, value=event_fingerprint).save()
    else:
        person_fingerprints = (
            [fp.value for fp in form_person.fingerprints]
            if form_person.fingerprints
            else None
        )
        if person_fingerprints and event_fingerprint not in person_fingerprints:
            Fingerprint(person_id=form_person.id, value=event_fingerprint).save()
    db.session.commit()
    return form_person

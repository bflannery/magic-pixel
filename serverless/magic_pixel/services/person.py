from magic_pixel.constants import AttributeTypeEnum
from magic_pixel.db import db
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute


#   {
#       <AttributeTypeEnum.FIRST_NAME: 'first_name'>: 'gzdy-fname',
#       <AttributeTypeEnum.LAST_NAME: 'last_name'>: 'customer[lname]',
#       <AttributeTypeEnum.EMAIL: 'email'>: 'gx7zy-email',
#       <AttributeTypeEnum.TEXT: 'text'>: 'anonymous'
#   }


def save_account_person_attributes(
    account_id, person_id, event_form_id, form_fields, form_type_field_map
):
    try:
        for form_field_key, form_field_value in form_type_field_map.items():
            # Check if field key attribute exists
            account_attribute = Attribute.query.filter(
                Attribute.account_id == account_id,
                Attribute.event_form_id == event_form_id,
                Attribute.type != AttributeTypeEnum.TEXT,
            ).first()

            if not account_attribute or account_attribute.type:
                new_attribute = Attribute(
                    account_id=account_id,
                    event_form_id=event_form_id,
                    type=form_field_key,
                    name=form_field_value,
                ).save()

                person_attribute_value = form_fields[form_field_value]
                PersonAttribute(
                    person_id=person_id,
                    attribute=new_attribute,
                    value=person_attribute_value,
                ).save()
                db.session.commit()
        return True
    except Exception as e:
        raise e


def identify_person_on_event(account_id, event_fingerprint, person_id=None):
    # Look up person by id
    if person_id:
        person = Person.get_by_mp_id(person_id)
        if not person:
            raise Exception(f"No person found with id {person_id}")
        # Check if fingerprint exists already on the person, if not create a new one
        if event_fingerprint not in person.fingerprints:
            Fingerprint(person=person, value=event_fingerprint).save()
            db.session.commit()
        return person

    # Lookup person by fingerprint
    form_person = (
        Person.query.join(Fingerprint)
        .filter(Fingerprint.value == event_fingerprint)
        .first()
    )

    if not form_person:
        # We have no idea who you are, create a new person and fingerprint
        form_person = Person(account_id=account_id).save()
        Fingerprint(person=form_person, value=event_fingerprint).save()
    else:
        if event_fingerprint not in form_person.fingerprints:
            Fingerprint(person_id=form_person.id, value=event_fingerprint).save()
    db.session.commit()
    return form_person

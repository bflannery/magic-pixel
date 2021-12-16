import pytest
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute
from magic_pixel.services.event_form import get_form_type, build_form_field_map
from magic_pixel.services.person import (
    identify_person_on_event,
)
from tests.factories.person_factory import (
    PersonFactory,
    AttributeFactory,
    PersonAttributeFactory,
)
from tests.mocks import MOCK_FORM_SUBMIT_EVENT, MOCK_PAGE_VIEW_EVENT
from tests.mocks.form_submit import MOCK_FORM_FIELDS, MOCK_FORM_UUID




def test_build_form_field_map_existing_attributes(db, account):
    first_name = "Testy"
    last_name = "McTester"
    email = "testy_mctester@gmail.com"
    first_name_key = "gzdy-first-name"
    last_name_key = "customer[lname]"
    email_key = "gx7zy-email"
    form_fields = {
        first_name_key: first_name,
        last_name_key: last_name,
        email_key: email,
        "anonymous": ["78721", "Sign up"],
    }

    attribute_1 = AttributeFactory(
        account=account, name=first_name_key, type=AttributeTypeEnum.FIRST_NAME
    )
    attribute_2 = AttributeFactory(
        account=account, name=last_name_key, type=AttributeTypeEnum.LAST_NAME
    )
    attribute_3 = AttributeFactory(
        account=account, name=email_key, type=AttributeTypeEnum.EMAIL
    )

    form_field_map = build_form_field_map(account.id, form_fields)

    account_attributes = Attribute.query.filter_by(account_id=account.id).all()

    assert len(account_attributes) == 4
    assert form_field_map[attribute_1.id]
    assert form_field_map[attribute_2.id]
    assert form_field_map[attribute_3.id]


def test_identify_form_type_by_form_id(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
    mock_event["form"]["formId"] = "create_customer"
    first_name = "Testy"
    last_name = "McTester"
    email = "testy_mctester@gmail.com"
    fingerprint = mock_event["fingerprint"]
    form_fields = (
        {
            "gzdy-first-name": first_name,
            "customer[lname]": last_name,
            "gx7zy-email": email,
            "anonymous": ["78721", "Sign up"],
        },
    )
    mock_event["form"]["form_fields "] = form_fields
    mock_event["accountHid"] = account.mp_id

    identify_person_on_event(account.id, mock_event)


# def test_identify_new_person_on_form_submit_by_form_inputs_ids(account):
#     mock_event = MOCK_FORM_SUBMIT_EVENT
#     first_name = "Testy"
#     last_name = "McTester"
#     email = "testy_mctester@gmail.com"
#     fingerprint = mock_event["fingerprint"]
#     first_name_key = "gzdy-first-name"
#     last_name_key = "customer[lname]"
#     email_key = "gx7zy-email"
#     form_fields = {
#         first_name_key: first_name,
#         last_name_key: last_name,
#         email_key: email,
#         "anonymous": ["78721", "Sign up"],
#     }
#     mock_event["form"]["formFields"] = form_fields
#     mock_event["accountHid"] = account.mp_id
#
#     identify_person_on_event(account.id, mock_event)
#
#     # Check person exists
#     person = (
#         Person.query.join(PersonAttribute)
#         .filter(Person.account_id == account.id, PersonAttribute.value == email)
#         .first()
#     )
#     assert person
#
#     # Check form attributes exists on the account
#     form_attributes = Attribute.query.filter_by(account_id=account.id).all()
#     form_attributes_keys = [fa.name for fa in form_attributes]
#     assert first_name_key in form_attributes_keys
#     assert last_name_key in form_attributes_keys
#     assert email_key in form_attributes_keys
#
#     # Check person attributes exist and values match
#     person_attributes = PersonAttribute.query.filter_by(person_id=person.id).all()
#     assert next(
#         (pa for pa in person_attributes if pa.value == first_name),
#         None,
#     )
#     assert next(
#         (pa for pa in person_attributes if pa.value == last_name),
#         None,
#     )
#     assert next(
#         (pa for pa in person_attributes if pa.value == email),
#         None,
#     )
#
#     # Check event fingerprint is attached to the person
#     person_fingerprint = Fingerprint.query.filter_by(
#         person_id=person.id, value=fingerprint
#     ).first()
#     assert person_fingerprint
#
#
# def test_update_person_attributes_on_form_event(account):
#     person = PersonFactory(account=account)
#     email_attribute = AttributeFactory(
#         account=account, name="gx7zy-email", type=AttributeTypeEnum.EMAIL
#     )
#     person_email_attribute = PersonAttributeFactory(
#         person=person, attribute=email_attribute, value="test_email@gmail.com"
#     )
#     updated_email = "test_update_email@gmail.com"
#     mock_event_form = MOCK_FORM_UUID
#     mock_event_form["formFields"]["gx7zy-email"] = updated_email
#     updated_person_attributes = update_person_attributes_on_form_event(
#         account.id, person.id, mock_event_form["formFields"]
#     )
#     assert updated_person_attributes[0].id == person_email_attribute.id
#     assert updated_person_attributes[0].value == updated_email


###################################################### DELETE ABOVE #############################################


def test_identify_new_person_by_fingerprint_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountHid"] = account.mp_id
    event_person_fingerprint = mock_event["fingerprint"]
    person = identify_person_on_event(
        account.id, event_person_fingerprint, person_id=None
    )
    assert person
    assert person.account_id == account.id
    assert person.fingerprints
    assert event_person_fingerprint in person.fingerprints


def test_identify_existing_person_by_id_on_event(account):
    person = PersonFactory(account=account)
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountHid"] = account.mp_id
    mock_event["personId"] = person.mp_id
    event_fingerprint = mock_event["fingerprint"]
    identified_person = identify_person_on_event(
        account.id, event_fingerprint, person_id=person.mp_id
    )
    assert identified_person
    assert identified_person.account_id == account.id
    assert identified_person.id == person.id

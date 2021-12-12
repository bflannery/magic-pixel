import pytest
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum
from magic_pixel.models.person import Person, Fingerprint
from magic_pixel.services.person import (
    identify_event_person,
    get_form_type,
    build_form_field_map,
    update_person_attributes_on_form_event,
)
from tests.factories.person_factory import (
    PersonFactory,
    AttributeFactory,
    PersonAttributeFactory,
)
from tests.mocks import MOCK_FORM_SUBMIT_EVENT, MOCK_PAGE_VIEW_EVENT
from tests.mocks.form_submit import MOCK_FORM_FIELDS, MOCK_FORM_UUID


def test_get_form_type_login():
    form_id = "gzdy-loginCustomer"
    form_type = get_form_type(form_id)
    assert form_type == EventFormTypeEnum.LOGIN


def test_get_form_type_sign_up():
    form_id = "gzdy-register[Customer]"
    form_type = get_form_type(form_id)
    assert form_type == EventFormTypeEnum.SIGN_UP


def test_build_form_field_map_by_input_name_login(account):
    first_name = MOCK_FORM_FIELDS["gzdy-fname"]
    last_name = MOCK_FORM_FIELDS["customer[lname]"]
    email = MOCK_FORM_FIELDS["gx7zy-email"]
    # form_fields_keys = MOCK_FORM_FIELDS.keys()
    form_type = EventFormTypeEnum.LOGIN
    form_type_field_map = build_form_field_map(account.id, MOCK_FORM_FIELDS, form_type)
    assert form_type_field_map["email"] == email
    assert form_type_field_map["first_name"] == first_name
    assert form_type_field_map["last_name"] == last_name


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

    identify_event_person(account.id, mock_event)


def test_identify_person_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountHid"] = account.mp_id
    event_person_fingerprint = mock_event["fingerprint"]
    identify_event_person(account.id, mock_event)
    person = Person.query.filter_by(
        account_id=account.id, fingerprint=event_person_fingerprint
    ).first()
    assert person
    assert person.account_id == account.id


def test_identify_new_person_on_form_submit_by_form_inputs_ids(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
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

    identify_event_person(account.id, mock_event)

    person = Person.query.filter_by(email=email).first()
    assert person
    assert person.first_name == first_name
    assert person.last_name == last_name
    assert person.email == email
    fingerprint = Fingerprint.query.filter_by(
        person_id=person.id, value=fingerprint
    ).first()
    assert person.fingerprints[0].value == fingerprint.value


def test_update_person_attributes_on_form_event(account):
    person = PersonFactory(account=account)
    email_attribute = AttributeFactory(
        account=account, name="gx7zy-email", type=AttributeTypeEnum.EMAIL
    )
    person_email_attribute = PersonAttributeFactory(
        person=person, attribute=email_attribute, value="test_email@gmail.com"
    )
    updated_email = "test_update_email@gmail.com"
    mock_event_form = MOCK_FORM_UUID
    mock_event_form["formFields"]["gx7zy-email"] = updated_email
    updated_person_attributes = update_person_attributes_on_form_event(
        account.id, person.id, mock_event_form["formFields"]
    )
    assert updated_person_attributes[0].id == person_email_attribute.id
    assert updated_person_attributes[0].value == updated_email

import pytest
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum
from magic_pixel.models.person import Person, Fingerprint, Attribute, PersonAttribute
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


def test_identify_new_person_on_event(account):
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
    first_name_key = "gzdy-first-name"
    last_name_key = "customer[lname]"
    email_key = "gx7zy-email"
    form_fields = {
        first_name_key: first_name,
        last_name_key: last_name,
        email_key: email,
        "anonymous": ["78721", "Sign up"],
    }
    mock_event["form"]["formFields"] = form_fields
    mock_event["accountHid"] = account.mp_id

    identify_event_person(account.id, mock_event)

    # Check person exists
    person = (
        Person.query.join(PersonAttribute)
        .filter(Person.account_id == account.id, PersonAttribute.value == email)
        .first()
    )
    assert person

    # Check form attributes exists on the account
    form_attributes = Attribute.query.filter_by(account_id=account.id).all()
    form_attributes_keys = [fa.name for fa in form_attributes]
    assert first_name_key in form_attributes_keys
    assert last_name_key in form_attributes_keys
    assert email_key in form_attributes_keys

    # Check person attributes exist and values match
    person_attributes = PersonAttribute.query.filter_by(person_id=person.id).all()
    assert next(
        (pa for pa in person_attributes if pa.value == first_name),
        None,
    )
    assert next(
        (pa for pa in person_attributes if pa.value == last_name),
        None,
    )
    assert next(
        (pa for pa in person_attributes if pa.value == email),
        None,
    )

    # Check event fingerprint is attached to the person
    person_fingerprint = Fingerprint.query.filter_by(
        person_id=person.id, value=fingerprint
    ).first()
    assert person_fingerprint


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

import pytest
from magic_pixel.constants import EventFormTypeEnum, AttributeTypeEnum, EventTypeEnum
from magic_pixel.models import Person, EventForm
from magic_pixel.services.event_form import (
    get_form_type,
    build_form_field_map,
    ingest_event_form,
)
from tests.factories import EventFactory
from tests.factories.person_factory import PersonFactory
from tests.mocks import MOCK_FORM_SUBMIT_EVENT


def test_get_form_type_login():
    form_id = "gzdy-loginCustomer"
    form_type = get_form_type(form_id)
    assert form_type == EventFormTypeEnum.LOGIN


def test_get_form_type_sign_up():
    form_id = "gzdy-register[Customer]"
    form_type = get_form_type(form_id)
    assert form_type == EventFormTypeEnum.SIGN_UP


def test_build_form_field_map(account):
    first_name_value = "Testy"
    last_name_value = "McTester"
    email_value = "testy_mctester@gmail.com"
    anon_values = ["78721", "Sign up"]
    first_name_key = "gzdy-first-name"
    last_name_key = "customer[lname]"
    email_key = "gx7zy-email"
    anon_key = "anonymous"
    form_fields = {
        first_name_key: first_name_value,
        last_name_key: last_name_value,
        email_key: email_value,
        anon_key: anon_values,
    }
    form_field_map = build_form_field_map(form_fields)
    assert form_field_map[AttributeTypeEnum.EMAIL] == email_key


def test_ingest_event_form(account):
    event_person = PersonFactory(account=account)
    mock_form_event = MOCK_FORM_SUBMIT_EVENT
    mock_form_event["accountId"] = account.mp_id
    mock_form_event["personId"] = event_person.mp_id
    mock_form_uuid = mock_form_event["form"]["formId"]
    db_event = EventFactory(
        account=account, person=event_person, type=EventTypeEnum.FORM_SUBMIT
    )
    ingest_event_form(account.id, event_person.id, db_event.id, mock_form_event)
    event_form = EventForm.query.filter_by(form_id=mock_form_uuid).first()
    assert event_form

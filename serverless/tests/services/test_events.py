import pytest
from magic_pixel.models import Event, EventForm
from magic_pixel.models.person import Person, Attribute, PersonAttribute, Fingerprint
from magic_pixel.services.event import (
    ingest_event_message,
)
from tests.mocks import MOCK_CLICK_EVENT, MOCK_PAGE_VIEW_EVENT, MOCK_FORM_SUBMIT_EVENT


def test_ingest_account_pageview_event_message_new_person(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_event["siteId"] = account_site.mp_id
    ingest_event_message(mock_event)
    events = Event.query.filter_by(account_id=account.id).all()
    assert len(events) == 1


def test_ingest_click_event_message_new_person(account):
    mock_event = MOCK_CLICK_EVENT
    mock_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_event["siteId"] = account_site.mp_id
    ingest_event_message(mock_event)
    events = Event.query.all()
    assert len(events) == 1


def test_ingest_form_event_message_new_person(account):
    mock_form_event = MOCK_FORM_SUBMIT_EVENT
    mock_form_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_form_event["siteId"] = account_site.mp_id
    mock_form_uuid = mock_form_event["form"]["formId"]
    event_fingerprint = mock_form_event["fingerprint"]
    ingest_event_message(mock_form_event)
    event_person = (
        Person.query.join(Fingerprint)
        .filter(Person.account_id == account.id, Fingerprint.value == event_fingerprint)
        .first()
    )
    event_form = EventForm.query.filter_by(form_id=mock_form_uuid).first()
    assert event_form
    form_attributes = Attribute.query.filter_by(event_form_id=event_form.id).all()
    assert form_attributes
    for form_attribute in form_attributes:
        person_attribute = PersonAttribute.query.filter_by(
            attribute_id=form_attribute.id
        ).first()
        assert person_attribute
        assert person_attribute.person_id == event_person.id

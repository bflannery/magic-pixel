import pytest
import json

from magic_pixel.models import Event
from magic_pixel.models.person import Person
from magic_pixel.services.events import (
    ingest_event_message,
)
from tests.mocks import MOCK_CLICK_EVENT, MOCK_PAGE_VIEW_EVENT, MOCK_FORM_SUBMIT_EVENT


def test_ingest_account_pageview_event_message(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountHid"] = account.mp_id
    ingest_event_message(mock_event)
    events = Event.query.filter_by(account_id=account.id).all()
    assert len(events) == 1


def test_ingest_click_event_message(account):
    mock_event = MOCK_CLICK_EVENT
    mock_event["accountHid"] = account.mp_id
    ingest_event_message(mock_event)
    events = Event.query.all()
    assert len(events) == 1


def test_ingest_formsubmit_event_message(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
    mock_event["accountHid"] = account.mp_id
    ingest_event_message(mock_event)
    events = Event.query.all()
    assert len(events) == 1

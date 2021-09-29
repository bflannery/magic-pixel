import pytest
import json

from magic_pixel.models import Event
from magic_pixel.services.events import consume_event_message, query_events


def test_consume_pageview_event_message():
    f = open("../mocks/pageview.json")
    mock_pageview_event = json.load(f)
    consume_event_message(mock_pageview_event)
    events = Event.query.all()
    assert len(events) == 1


def test_consume_click_event_message():
    f = open("../mocks/click.json")
    mock_click_event = json.load(f)
    consume_event_message(mock_click_event)
    events = Event.query.all()
    assert len(events) == 1


def test_query_for_events(pageview_event):
    events = query_events()
    print(events)

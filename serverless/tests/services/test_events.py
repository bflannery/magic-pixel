from datetime import datetime
import json
import pytest

from magic_pixel.models import Event
from magic_pixel.services.events import consume_event_message, query_events
from tests.factories import EventFactory


# def test_consume_event_message():
#     f = open("../mocks/pageview.json")
#     mock_click_event = json.load(f)
#     consume_event_message(mock_click_event)
#     events = Event.query.all()
#     assert len(events) == 1


def test_query_for_events(pageview_event):
    events = query_events()
    print(events)

import datetime

from magic_pixel.models import Event
from .meta import BaseFactory


class EventFactory(BaseFactory):
    class Meta:
        model = Event

    session_id = "d12aa77d-9320-0c55-c9f7-342febb6f8f0"

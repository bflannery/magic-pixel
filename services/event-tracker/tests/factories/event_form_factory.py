from server.models import EventForm
from .meta import BaseFactory


class EventFormFactory(BaseFactory):
    class Meta:
        model = EventForm

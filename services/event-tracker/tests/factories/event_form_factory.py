from magic_pixel.models import EventForm
from .meta import BaseFactory


class EventFormFactory(BaseFactory):
    class Meta:
        model = EventForm

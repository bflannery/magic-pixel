from magic_pixel.models import EventTarget
from .meta import BaseFactory


class EventTargetFactory(BaseFactory):
    class Meta:
        model = EventTarget

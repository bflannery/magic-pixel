from magic_pixel.models import EventLocale
from .meta import BaseFactory


class EventLocaleFactory(BaseFactory):
    class Meta:
        model = EventLocale

    language = 'en-US'
    tz_offset = '300'

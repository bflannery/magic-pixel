import datetime

from magic_pixel.models import Event
from .meta import BaseFactory


class EventFactory(BaseFactory):
    class Meta:
        model = Event

    site_id = "3aNgZ99g"
    q_id = "g7BCbR3CVE7egGVZ"
    fingerprint = "a1a5185f519554c6011ce9c14483965t"
    visitor_id = "91cbbfee-fe49-c430-51ac-031a323c5b61"
    event_timestamp = datetime.datetime.utcnow()

import json

from server.models import EventSource
from .meta import BaseFactory


class EventSourceFactory(BaseFactory):
    class Meta:
        model = EventSource

    url = "http://localhost:8080/"
    parameters = json.dumps(
        {
            "host": "localhost:8080",
            "hostname": "localhost",
            "pathname": "/",
            "protocol": "http:",
        }
    )

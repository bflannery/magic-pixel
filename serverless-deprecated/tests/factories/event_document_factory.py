import json

from magic_pixel.models import EventDocument
from .meta import BaseFactory


class EventDocumentFactory(BaseFactory):
    class Meta:
        model = EventDocument

    document_url = "http://localhost:8080/"
    document_parameters = json.dumps(
        {
            "host": "localhost:8080",
            "hostname": "localhost",
            "pathname": "/",
            "protocol": "http:",
        }
    )

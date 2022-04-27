import json

from server.models import EventBrowser
from .meta import BaseFactory


class EventBrowserFactory(BaseFactory):
    class Meta:
        model = EventBrowser

    language = 'en-US'
    name = 'Chrome'
    platform = 'Mac'
    plugins = json.dumps([
            {
                "name": "Chrome PDF Plugin",
                "description": "Portable Document Format",
                "filename": "internal-pdf-viewer",
                "mimeType": {
                    "type": "application/x-google-chrome-pdf",
                    "description": "Portable Document Format",
                    "suffixes": "pdf"
                }
            },
            {
                "name": "Chrome PDF Viewer",
                "filename": "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                "mimeType": {"type": "application/pdf", "suffixes": "pdf"}
            },
            {
                "name": "Native Client",
                "filename": "internal-nacl-plugin",
                "mimeType": {
                    "type": "application/x-nacl",
                    "description": "Native Client Executable"
                }
            }
        ])

    ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
    version = 1
    screen_cd = 30
    screen_height = 900
    screen_width = 1440

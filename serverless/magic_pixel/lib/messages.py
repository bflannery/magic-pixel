from typing import Optional

from .aws_sqs import Queue
from dataclasses import dataclass
from werkzeug.local import LocalProxy
from flask import current_app

event_queue = LocalProxy(lambda: Queue(current_app.config.get("EVENT_QUEUE_NAME")))

event_browser_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_BROWSER_QUEUE_NAME"))
)

event_document_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_DOCUMENT_QUEUE_NAME"))
)

event_form_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_FORM_QUEUE_NAME"))
)

event_locale_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_LOCALE_QUEUE_NAME"))
)

event_source_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_SOURCE_QUEUE_NAME"))
)

event_target_queue = LocalProxy(
    lambda: Queue(current_app.config.get("EVENT_TARGET_QUEUE_NAME"))
)


@dataclass
class EventMessage:
    site_id: int
    event_type: str
    fingerprint: Optional[str]
    q_id: Optional[str]
    session_id: Optional[str]
    visitor_id: Optional[str]
    user_id: Optional[str]
    user_profile: Optional[str]
    event_timestamp: Optional[str]


@dataclass
class EventBrowserMessage:
    language: str
    name: Optional[str]
    plugins: Optional[str]
    ua: Optional[str]
    version: Optional[str]
    screen_cd: Optional[str]
    screen_height: Optional[str]
    screen_width: Optional[str]


@dataclass
class EventDocumentMessage:
    title: Optional[str]
    referrer: Optional[str]
    document_url: str
    document_parameters: Optional[str]
    referral_parameters: Optional[str]


@dataclass
class EventFormMessage:
    form_id: str
    form_fields: str


@dataclass
class EventLocaleMessage:
    language: Optional[str]
    tz_offset: Optional[str]


@dataclass
class EventSourceMessage:
    url: str
    parameters: Optional[str]


@dataclass
class EventTargetMessage:
    url: int
    selector: Optional[str]
    parameters: Optional[str]

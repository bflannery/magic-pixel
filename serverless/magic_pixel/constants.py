import enum


class EventMessageTypes(enum.Enum):
    EVENT = "event"
    EVENT_BROWSER = "event_browser"
    EVENT_DOCUMENT = "event_document"
    EVENT_FORM = "event_form"
    EVENT_LOCALE = "event_locale"
    EVENT_SOURCE = "event_source"
    EVENT_TARGET = "event_target"

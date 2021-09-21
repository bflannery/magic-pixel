from magic_pixel.lib.messages import (
    EventBrowserMessage,
    EventDocumentMessage,
    EventFormMessage,
    EventLocaleMessage,
    EventMessage,
    EventSourceMessage,
    EventTargetMessage,
    event_browser_queue,
    event_document_queue,
    event_form_queue,
    event_locale_queue,
    event_queue,
    event_source_queue,
    event_target_queue,
)


def publish_event_message(message):
    return event_queue.send_message(message)


def publish_event_browser_message(message: EventBrowserMessage):
    return event_browser_queue.send_message(message)


def publish_event_document_message(message: EventDocumentMessage):
    return event_document_queue.send_message(message)


def publish_event_form_message(message: EventFormMessage):
    return event_form_queue.send_message(message)


def publish_event_locale_message(message: EventLocaleMessage):
    return event_locale_queue.send_message(message)


def publish_event_source_message(message: EventSourceMessage):
    return event_source_queue.send_message(message)


def publish_event_target_message(message: EventTargetMessage):
    return event_target_queue.send_message(message)

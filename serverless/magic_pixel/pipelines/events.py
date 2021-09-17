from magic_pixel.lib.aws_sqs import QueueConsumer
from magic_pixel.lib.messages import (
    EventBrowserMessage,
    EventDocumentMessage,
    EventFormMessage,
    EventLocaleMessage,
    EventMessage,
    EventSourceMessage,
    EventTargetMessage,
)
from magic_pixel.services.events import (
    save_event_browser_message,
    save_event_document_message,
    save_event_form_message,
    save_event_locale_message,
    save_event_message,
    save_event_source_message,
    save_event_target_message,
)


class EventConsumer(QueueConsumer):
    message_parser = EventMessage

    def consume_message(
        self, sqs_id: str, message: EventMessage, context: dict
    ) -> bool:
        print(f"consume event message_id : {sqs_id}")
        result = save_event_message(message)
        return result


class EventBrowserConsumer(QueueConsumer):
    message_parser = EventBrowserMessage

    def consume_message(
        self, sqs_id: str, message: EventBrowserMessage, context: dict
    ) -> bool:
        print(f"consume event browser message_id : {sqs_id}")
        result = save_event_browser_message(message)
        return result


class EventDocumentConsumer(QueueConsumer):
    message_parser = EventDocumentMessage

    def consume_message(
        self, sqs_id: str, message: EventDocumentMessage, context: dict
    ) -> bool:
        print(f"consume event document message_id : {sqs_id}")
        result = save_event_document_message(message)
        return result


class EventFormConsumer(QueueConsumer):
    message_parser = EventFormMessage

    def consume_message(
        self, sqs_id: str, message: EventFormMessage, context: dict
    ) -> bool:
        print(f"consume event form message_id : {sqs_id}")
        result = save_event_form_message(message)
        return result


class EventLocaleConsumer(QueueConsumer):
    message_parser = EventLocaleMessage

    def consume_message(
        self, sqs_id: str, message: EventLocaleMessage, context: dict
    ) -> bool:
        print(f"consume event locale message_id : {sqs_id}")
        result = save_event_locale_message(message)
        return result


class EventSourceConsumer(QueueConsumer):
    message_parser = EventSourceMessage

    def consume_message(
        self, sqs_id: str, message: EventSourceMessage, context: dict
    ) -> bool:
        print(f"consume event source message_id : {sqs_id}")
        result = save_event_source_message(message)
        return result


class EventTargetConsumer(QueueConsumer):
    message_parser = EventTargetMessage

    def consume_message(
        self, sqs_id: str, message: EventTargetMessage, context: dict
    ) -> bool:
        print(f"consume event target message_id : {sqs_id}")
        result = save_event_target_message(message)
        return result

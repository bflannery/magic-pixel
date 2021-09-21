import functools
import json

from app import app
from magic_pixel.lib.aws_sqs import sqs_job
import magic_pixel.pipelines.events as event_queues
from magic_pixel.constants import EventMessageTypes
from magic_pixel.lib.messages import (
    EventBrowserMessage,
    EventDocumentMessage,
    EventFormMessage,
    EventLocaleMessage,
    EventMessage,
    EventSourceMessage,
    EventTargetMessage,
)
from magic_pixel.services.messages import (
    publish_event_browser_message,
    publish_event_document_message,
    publish_event_form_message,
    publish_event_locale_message,
    publish_event_message,
    publish_event_source_message,
    publish_event_target_message,
)


def serverless_function(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        with app.app_context():
            return func(*args, **kwargs)

    return inner


@serverless_function
def send_event(event, context):
    print("send_event")

    # event_body = json.loads(event["body"])
    # event_type = event_body["event_type"]
    # event_data = event_body["data"]
    publish_event_message(event)

    # if event_type == EventMessageTypes.EVENT.value:
    #     publish_event_message(EventMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_BROWSER:
    #     publish_event_browser_message(EventBrowserMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_DOCUMENT:
    #     publish_event_document_message(EventDocumentMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_FORM:
    #     publish_event_form_message(EventFormMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_LOCALE:
    #     publish_event_locale_message(EventLocaleMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_SOURCE:
    #     publish_event_source_message(EventSourceMessage(**event_data))
    # elif event_type == EventMessageTypes.EVENT_TARGET:
    #     publish_event_target_message(EventTargetMessage(**event_data))
    # else:
    #     raise Exception(f"Unexpected event type {event_type}")

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(
            {
                "status": "success",
                "description": f"Messages successfully sent to event queue.",
            }
        ),
    }


@serverless_function
def consume_event(event, context):
    sqs_job("consume_event", event, context, event_queues.EventConsumer())


@serverless_function
def consume_event_browser(event, context):
    sqs_job("consume_event_browser", event, context, event_queues.EventConsumer())


@serverless_function
def consume_event_document(event, context):
    sqs_job(
        "consume_event_document", event, context, event_queues.EventBrowserConsumer()
    )


@serverless_function
def consume_event_form(event, context):
    sqs_job("consume_event_form", event, context, event_queues.EventFormConsumer())


@serverless_function
def consume_event_locale(event, context):
    sqs_job("consume_event_locale", event, context, event_queues.EventLocaleConsumer())


@serverless_function
def consume_event_source(event, context):
    sqs_job("consume_event_source", event, context, event_queues.EventSourceConsumer())


@serverless_function
def consume_event_target(event, context):
    sqs_job("consume_event_target", event, context, event_queues.EventTargetConsumer())

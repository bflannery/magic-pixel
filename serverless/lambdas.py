import functools
import json

from app import app
from magic_pixel import logger
from magic_pixel.lib.aws_sqs import RetryException
from magic_pixel.services.events import queue_event_message, consume_event_message


def serverless_function(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        with app.app_context():
            return func(*args, **kwargs)

    return inner


@serverless_function
def send_event(event, context):
    print("Sending event messages to the event queue ")

    queue_event_message(event)
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
    print(f'CONSUME_EVENT: {event}')
    records = event.get("Records", [])
    logger.log_info(f"consume_event| {len(records)}")
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        logger.log_info(f"consuming event message: {message_id}")
        try:
            lambda_body_string = record.get("body")
            lambda_message = json.loads(lambda_body_string)
            event_message = json.loads(lambda_message["body"])
            consume_succeeded = consume_event_message(event_message)
            has_failed |= not consume_succeeded
        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()

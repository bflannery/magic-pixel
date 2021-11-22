import functools
import json

from app import app
from magic_pixel import logger
from magic_pixel.lib.aws_sqs import RetryException
from magic_pixel.models import Account
from magic_pixel.services.account import verify_account_status
from magic_pixel.services.events import queue_event_message, consume_event_message


def serverless_function(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        with app.app_context():
            return func(*args, **kwargs)

    return inner


@serverless_function
def send_event(event, context):
    logger.log_info("Sending event messages to the event queue.")
    account_status = verify_account_status(event.mpAccountId)
    if account_status != 'active':
        return {
            "statusCode": 403,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "status": "unauthorized",
                    "description": f"Account is inactive.",
                }
            ),
        }

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
    logger.log_info("Consuming event messages on the event queue.")
    records = event.get("Records", [])
    logger.log_info(f"{len(records)} in message batch.")
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        logger.log_info(f"consuming lambda record message: {message_id}")
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
    else:
        logger.log_info("Messages successfully consumed from event queue.")
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "status": "success",
                    "description": f"Messages successfully consumed from event queue.",
                }
            ),
        }


@serverless_function
def authentication(event, context):
    logger.log_info(f"Authentication Event: {event}")

    try:
        body = event.get("body")
        if not body:
            raise Exception("Event has no body object.")
        logger.log_info(f"Authentication Body: {body}")

        parsed_body = json.loads(body)
        hid = parsed_body.get("hid")
        if not hid:
            raise Exception("Event has no hid.")
        logger.log_info(f"Authentication Account HID: {hid}")

        account = Account.get_by_mp_id(hid)
        if not account:
            raise Exception(f"No account exists with hid: {hid}.")
        logger.log_info(f"Authentication Account: {account}")
        account_status = verify_account_status(event.mpAccountId)
        if account_status != 'active':
            return {
                "statusCode": 403,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(
                    {
                        "status": "unauthorized",
                        "description": f"Account is inactive.",
                    }
                ),
            }
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"status": account_status}),
        }

    except Exception as e:
        logger.log_exception(e)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "status": "error",
                    "description": "Internal server error.",
                }
            ),
        }

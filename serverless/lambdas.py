import functools
import json

from app import app
from magic_pixel import logger
from magic_pixel.lib.aws_sqs import RetryException
from magic_pixel.models import Account
from magic_pixel.services.account import (
    verify_account_status,
)
from magic_pixel.services.event import (
    queue_event_ingestion,
    ingest_event_message,
)
from magic_pixel.services.person import identify_person
from magic_pixel.services.identity import (
    identify_visitor,
    queue_identity_service,
    ingest_identity_message,
)


def serverless_function(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        with app.app_context():
            return func(*args, **kwargs)

    return inner


@serverless_function
def authentication(event, context):
    logger.log_info(f"Authentication Event")

    try:
        body = event.get("body")
        if not body:
            raise Exception("Event has no body object.")
        logger.log_info(f"Authentication Body: {body}")

        parsed_body = json.loads(body)
        account_status = verify_account_status(parsed_body)

        if account_status != "active":
            return {
                "statusCode": 403,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps(
                    {
                        "status": account_status,
                        "description": f"Account is inactive.",
                    }
                ),
            }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"accountStatus": "active"}),
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


@serverless_function
def collection(event, context):
    try:
        body = event.get("body")
        if not body:
            raise Exception("Event has no body object.")
        logger.log_info(f"Collection Body: {body}")

        parsed_body = json.loads(body)
        account_status = verify_account_status(parsed_body)
        if account_status != "active":
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

        queue_event_ingestion(event)
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
    except Exception as e:
        logger.log_exception(e)
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {
                    "status": "error",
                    "description": f"Server error. Messages failed to make it to event queue.",
                }
            ),
        }


@serverless_function
def ingestion(event, context):
    logger.log_info("Consuming event messages on the event queue.")
    # logger.log_info(f"Ingestion Event: {event}")
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
            ingestion_succeeded = ingest_event_message(event_message)
            has_failed |= not ingestion_succeeded
            if ingestion_succeeded:
                queue_identity_service(event_message)

        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()
    else:
        logger.log_info("Messages successfully consumed from the event queue.")
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


{
    "Records": [
        {
            "messageId": "e7b92462-5fe6-4272-a7d5-edd8ee06cf08",
            "receiptHandle": "e7b92462-5fe6-4272-a7d5-edd8ee06cf08#3e055dd3-b62e-4875-b28f-b8667c230eb3",
            "body": '{"fingerprint": "9292b510b524fd5cbf3f7b8e1b964739", "sessionId": "51061f58-d405-449a-2ffb-e83d0db5e3a4", "visitorId": "cc9b9c95-ea89-7c8c-6d01-d27434fe6175", "userId": null, "userProfile": null, "browser": {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", "name": "Chrome", "version": 96, "platform": "Mac", "language": "en-US", "plugins": [{"name": "Chrome PDF Plugin", "description": "Portable Document Format", "filename": "internal-pdf-viewer", "mimeType": {"type": "application/x-google-chrome-pdf", "description": "Portable Document Format", "suffixes": "pdf"}}, {"name": "Chrome PDF Viewer", "filename": "mhjfbmdgcfjbbpaeojofohoefgiehjai", "mimeType": {"type": "application/pdf", "suffixes": "pdf"}}, {"name": "Native Client", "filename": "internal-nacl-plugin", "mimeType": {"type": "application/x-nacl", "description": "Native Client Executable"}}]}, "document": {"title": "Shop Around", "url": {"host": "localhost:8080", "hostname": "localhost", "pathname": "/", "protocol": "http:"}}, "screen": {"height": 900, "width": 1440, "colorDepth": 30}, "locale": {"language": "en-US", "timezoneOffset": 360, "timezone": "America/Chicago"}, "url": {"host": "localhost:8080", "hostname": "localhost", "pathname": "/", "protocol": "http:"}, "timestamp": "2022-01-16T02:25:29.037Z", "event": "page_view", "source": {"url": {"host": "localhost:8080", "hostname": "localhost", "pathname": "/", "protocol": "http:"}}, "type": "page_view", "accountSiteId": "YWNjb3VudF9zaXRlOjE=", "visitorUUID": "ffc49d38-2fc6-5907-2091-909362336baf", "distinctPersonId": null}',
            "attributes": {
                "SentTimestamp": "1642299931425",
                "ApproximateReceiveCount": "1",
                "ApproximateFirstReceiveTimestamp": "1642299931425",
                "SenderId": "127.0.0.1",
            },
            "messageAttributes": {},
            "md5OfBody": "d76e66bfbe06c149084db9954069ec8e",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-1:000000000000:dev-identity-queue",
        }
    ]
}


@serverless_function
def identity(event, context):
    logger.log_info("Consuming event messages on the identity queue.")
    logger.log_info(f"Identity Event {event}")
    records = event.get("Records", [])
    logger.log_info(f"{len(records)} in message batch.")
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        logger.log_info(f"consuming lambda record message: {message_id}")
        try:
            lambda_body_string = record.get("body")
            event_message = json.loads(lambda_body_string)
            ingestion_succeeded = ingest_identity_message(event_message)
            has_failed |= not ingestion_succeeded
        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()
    else:
        logger.log_info("Messages successfully consumed from the identity queue.")
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

import json

from lambdas import serverless_function
from server import logger
from server.lib.aws_sqs import RetryException
from server.services.account import verify_account_status
from server.services.event import queue_event_ingestion, ingest_event_message
from server.services.identity import (
    queue_event_identity_service,
    ingest_event_identity_message,
)


@serverless_function
def event_collection(event, context):
    try:
        body = event.get("body")
        if not body:
            raise Exception("Event has no body object.")
        # logger.log_info(f"Collection Body: {body}")

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
def event_ingestion(event, context):
    logger.log_info("Consuming event messages on the event queue.")
    records = event.get("Records", [])

    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        # logger.log_info(f"consuming lambda record message: {message_id}")
        try:
            lambda_body_string = record.get("body")
            lambda_message = json.loads(lambda_body_string)
            event_message = json.loads(lambda_message["body"])
            ingestion_succeeded = ingest_event_message(event_message)
            has_failed |= not ingestion_succeeded
            if ingestion_succeeded:
                queue_event_identity_service(event_message)

        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()
    else:
        logger.log_info("Messages successfully consumed from the event queue.")


@serverless_function
def event_identity(event, context):
    logger.log_info("Consuming event messages on the identity queue.")
    # logger.log_info(f"Identity Event {event}")
    records = event.get("Records", [])
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        # logger.log_info(f"consuming lambda record message: {message_id}")
        try:
            lambda_body_string = record.get("body")
            event_message = json.loads(lambda_body_string)
            ingestion_succeeded = ingest_event_identity_message(event_message)
            has_failed |= not ingestion_succeeded
        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()
    else:
        logger.log_info("Messages successfully consumed from the identity queue.")

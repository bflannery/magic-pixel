import json

from lambdas import serverless_function
from magic_pixel import logger
from magic_pixel.lib.aws_sqs import RetryException
from magic_pixel.services.account import (
    verify_account_status,
)
from magic_pixel.services.identify_page import (
    queue_page_identification, ingest_page_identification_message
)


@serverless_function
def identify_page(event, context):
    logger.log_info("Page Identification API ingestion.")

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
        queue_page_identification(event)

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
def page_identification(event, context):
    logger.log_info("Consuming page identification messages on the identify page queue.")
    # logger.log_info(f"Page Identification Event: {event}")
    records = event.get("Records", [])
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        logger.log_info(f"Page Identification Lambda message id: {message_id}")
        try:
            lambda_body_string = record.get("body")
            lambda_message = json.loads(lambda_body_string)
            event_message = json.loads(lambda_message["body"])
            ingestion_succeeded = ingest_page_identification_message(event_message)
            has_failed |= not ingestion_succeeded
            if ingestion_succeeded:
                ...  # Kick of backend service for page identification

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


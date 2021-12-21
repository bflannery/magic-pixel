import functools
import json

from app import app
from magic_pixel import logger
from magic_pixel.lib.aws_sqs import RetryException
from magic_pixel.models import Account, AccountSite
from magic_pixel.services.account import verify_account_status
from magic_pixel.services.event import queue_event_ingestion, ingest_event_message
from magic_pixel.services.person import identify_person


def serverless_function(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        with app.app_context():
            return func(*args, **kwargs)

    return inner


def get_valid_account(account_mp_id):
    account = Account.get_by_mp_id(account_mp_id)
    if not account:
        raise Exception(f"No account exists with account id: {account_mp_id}.")
    return account


def get_valid_account_site(account_site_mp_id):
    account_site = AccountSite.get_by_mp_id(account_site_mp_id)
    if not account_site:
        raise Exception(f"No account site exists with id: {account_site_mp_id}.")
    return account_site


def validate_event_params_and_get_account(parsed_event_body):
    account_mp_id = parsed_event_body.get("accountId")
    account_site_mp_id = parsed_event_body.get("accountSiteId")

    if not account_mp_id:
        raise Exception("Event has no account id.")

    if not account_site_mp_id:
        raise Exception("Event has no site id.")

    account = get_valid_account(account_mp_id)
    account_site = get_valid_account_site(account_site_mp_id)
    if account and account_site:
        return account
    else:
        return None


@serverless_function
def authentication(event, context):
    logger.log_info(f"Authentication Event: {event}")

    try:
        body = event.get("body")
        if not body:
            raise Exception("Event has no body object.")
        logger.log_info(f"Authentication Body: {body}")

        parsed_body = json.loads(body)

        account = validate_event_params_and_get_account(parsed_body)
        logger.log_info(f"Authentication Account: {account}")

        account_status = verify_account_status(account)

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

        person_id = parsed_body.get("personId")
        fingerprint = parsed_body.get("fingerprint")
        person = identify_person(account.id, fingerprint, person_id)

        if not person:
            raise Exception(
                f"Could not find or create person with {fingerprint} and {person_id}"
            )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"personId": person.mp_id, "accountStatus": "active"}),
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
        logger.log_info("Sending event messages to the event queue.")

        event_body = json.loads(event["body"])
        # person_id = event_body["personId"]
        # fingerprint = event_body["fingerprint"]

        account_mp_id = event_body["accountId"]
        if not account_mp_id:
            raise Exception(f"No account exists with hid: {account_mp_id}.")

        account_site_id = event_body["accountSiteId"]
        if not account_site_id:
            raise Exception(f"No account site exists with hid: {account_site_id}.")

        account = Account.get_by_mp_id(account_mp_id)
        account_status = verify_account_status(account)
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

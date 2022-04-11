import json

from lambdas import serverless_function
from magic_pixel import logger
from magic_pixel.services.account import verify_account_status


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

import boto3
import json
import os
from werkzeug.local import LocalProxy
from flask import current_app
from magic_pixel import logger
from magic_pixel.utility import env

SQS_REGION_NAME = os.environ.get("SQS_ENDPOINT_URL", default="elasticmq")
SQS_ENDPOINT_URL = os.environ.get("SQS_ENDPOINT_URL", default="http://localhost:9324")

env = env()

sqs_config = {
    "endpoint_url": SQS_ENDPOINT_URL,
    "region_name": SQS_REGION_NAME,
}

if env == "local":
    sqs_config["use_ssl"] = False

print(sqs_config)
sqs_client = boto3.resource("sqs", **sqs_config)


class RetryException(Exception):
    """Exception to use to retry to currently running lambda.
    Helpful for triggering a retry w/o logging to sentry or logs
    """

    pass


class Queue:
    def __init__(self, name: str):
        self.queue = sqs_client.get_queue_by_name(QueueName=name)

    @staticmethod
    def _encode_message_body(message: dict) -> str:
        if isinstance(message, str):
            return message
        if isinstance(message, dict):
            return json.dumps(message)
        return str(message)

    def send_message(self, message: dict):
        try:
            self.queue.send_message(MessageBody=self._encode_message_body(message))
        except Exception as e:
            logger.log_exception(e)


event_queue = LocalProxy(lambda: Queue(current_app.config.get("EVENT_QUEUE_NAME")))

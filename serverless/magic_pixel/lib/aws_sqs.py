import boto3
import json
from werkzeug.local import LocalProxy
from flask import current_app
from magic_pixel import logger
from magic_pixel.utility import is_local


class RetryException(Exception):
    """Exception to use to retry to currently running lambda.
    Helpful for triggering a retry w/o logging to sentry or logs
    """

    pass


class Queue:
    def __init__(self, name: str):
        self.queue_name = name
        self.endpoint_url = current_app.config.get("SQS_ENDPOINT_URL")
        self.region_name = current_app.config.get("SQS_REGION")
        self.use_ssl = False if is_local() else True
        self.sqs_client = boto3.resource(
            "sqs",
            **{
                "endpoint_url": self.endpoint_url,
                "region_name": self.region_name,
                "use_ssl": self.use_ssl,
            },
        )
        self.queue = self.sqs_client.get_queue_by_name(QueueName=self.queue_name)

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


event_queue = LocalProxy(lambda: Queue(current_app.config.get("SQS_EVENT_QUEUE_NAME")))
event_identity_queue = LocalProxy(lambda: Queue(current_app.config.get("SQS_EVENT_IDENTITY_QUEUE_NAME")))
page_identification_queue = LocalProxy(lambda: Queue(current_app.config.get("SQS_PAGE_IDENTIFICATION_QUEUE_NAME")))

import boto3
import json
from werkzeug.local import LocalProxy
from flask import current_app
from magic_pixel import logger

# sqs_client = boto3.resource(
#     "sqs",
#     region_name="us-east-1",
#     endpoint="http://localhost:9324"
# )

sqs_client = boto3.resource(
    "sqs",
    endpoint_url="http://localhost:9324",
    region_name="elasticmq",
    aws_secret_access_key="x",
    aws_access_key_id="x",
    use_ssl=False,
)


class Queue:
    def __init__(self, name):
        self.queue = sqs_client.get_queue_by_name(QueueName=name)

    @staticmethod
    def _encode_message_body(message):
        if isinstance(message, str):
            return message
        if isinstance(message, dict):
            return json.dumps(message)
        return str(message)

    def send_message(self, message):
        try:
            self.queue.send_message(MessageBody=self._encode_message_body(message))
        except Exception as e:
            logger.log_exception(e)


event_queue = LocalProxy(lambda: Queue(current_app.config.get("EVENT_QUEUE_NAME")))


class RetryException(Exception):
    """Exception to use to retry to currently running lambda.
    Helpful for triggering a retry w/o logging to sentry or logs
    """
    pass

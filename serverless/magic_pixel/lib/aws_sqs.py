from typing import Callable, ClassVar, Generic, Tuple, Any, List, TypeVar
import enum
import boto3
import json
import dataclasses

from magic_pixel import logger

# sqs_client = boto3.resource(
#     "sqs",
#     region_name="us-east-1",
#     endpoint="http://localhost:9324"
# )

sqs_client = boto3.resource('sqs',
                        endpoint_url='http://localhost:9324',
                        region_name='elasticmq',
                        aws_secret_access_key='x',
                        aws_access_key_id='x',
                        use_ssl=False)

# converts dataclass enum property to a string
def enum_dataclass_dict_factory(values: List[Tuple[str, Any]]) -> dict:
    parsed_values = []
    for value in values:
        if isinstance(value[1], enum.Enum):
            parsed_values.append((value[0], value[1].value))
        else:
            parsed_values.append(value)

    return dict(parsed_values)


class Queue:
    def __init__(self, name):
        self.queue = sqs_client.get_queue_by_name(QueueName=name)

    @staticmethod
    def _encode_message_body(message):
        if isinstance(message, str):
            return message
        if isinstance(message, dict):
            return json.dumps(message)
        if dataclasses.is_dataclass(message):
            return json.dumps(
                dataclasses.asdict(message, dict_factory=enum_dataclass_dict_factory)
            )
        return str(message)

    def send_message(self, message):
        try:
            self.queue.send_message(MessageBody=self._encode_message_body(message))
        except Exception as e:
            logger.log_exception(e)


T = TypeVar("T")


class QueueConsumer(Generic[T]):
    """Abstract consumer class for sqs queues.
    takes a sqs record convert them using message_parser,
    then call consume_message one message at a time.
    For a given queue, subclass this, set message_parser to a dataclass the messages conform to or a function to convert the data to a class,
    and implement consume_message to consume each message from the queue.

    consumer.consume(a sqs record dict) -> consumer.parse_message(record) --convert--> consumer.consume(message)


    ```
    Example:
    @dataclass
    class ExampleMessage:
        example_id: int
        should_do_something: bool

    class ExampleQueueConsumer(QueueConsumer):
        message_parser = ExampleMessage
        # def message_parser(self, **data):
            return ExampleMessage(**data) or whatever

        def consume_message(self, sqs_id, message, context):
            print(sqs_id)
            if message.should_do_something:
                try:
                    do_something(message.example_id)
                except:
                    return False
            return True
    """

    message_parser: ClassVar[Callable[..., T]]

    def parse_message(self, record: dict, context: dict) -> T:
        """ takes a sqs record and calls message_parser to convert it. """
        body_string = record.get("body")
        body = json.loads(body_string)
        return self.message_parser(**body)

    def consume(self, sqs_id: str, record: dict, context: dict) -> bool:
        """ consume a sqs record. default is to convert to dataclass and call consume_message"""
        message = self.parse_message(record, context)
        return self.consume_message(sqs_id, message, context)

    def consume_message(self, sqs_id: str, message: T, context: dict) -> bool:
        """Implement this to handle a message from the queue.
        sqs_id: id assigned to the message by sqs
        message: the message, of type message_parser return value or whatever parse_message returns if that method is overwritten
        context: lambda function context
        """
        raise NotImplementedError("consume_message not implemented")


class RetryException(Exception):
    """Exception to use to retry to currently running lambda.
    Helpful for triggering a retry w/o logging to sentry or logs
    """

    pass


def sqs_job(name, event, context, consumer):
    records = event.get("Records", [])
    logger.log_info(f"{name} | {len(records)}")
    has_failed = False
    for record in records:
        message_id = record.get("messageId")
        logger.log_info(f"consuming message: {message_id}")
        try:
            consume_succeeded = consumer.consume(message_id, record, context)
            has_failed |= not consume_succeeded
        except Exception as e:
            logger.log_exception(e)
            has_failed = True
    if has_failed:
        raise RetryException()

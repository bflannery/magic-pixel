from magic_pixel import logger
from magic_pixel.lib.aws_sqs import content_identification_queue


def ingest_content_identification_message(event) -> bool:
    logger.log_info(f"ingest_content_identification_message: {event}")
    try:
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


def queue_content_identification(event: dict) -> bool:
    return content_identification_queue.send_message(event)

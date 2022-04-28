from magic_pixel import logger
from magic_pixel.lib.aws_sqs import page_identification_queue


def ingest_page_identification_message(event) -> bool:
    logger.log_info(f"ingest_page_identification_message: {event}")
    try:
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


def queue_page_identification(event: dict) -> bool:
    return page_identification_queue.send_message(event)

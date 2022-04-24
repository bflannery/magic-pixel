from flask import current_app


def log_exception(exc):
    current_app.logger.error(f"Exception", exc_info=exc)


def log_error(message):
    current_app.logger.error(message)


def log_info(message):
    current_app.logger.info(message)


def log_warning(message):
    current_app.logger.warning(message)

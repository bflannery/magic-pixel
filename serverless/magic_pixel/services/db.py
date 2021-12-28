from magic_pixel import logger
from magic_pixel.models import Event, EventBrowser, EventDocument, EventForm, EventLocale, EventSource, EventTarget


def query_events():
    try:
        return Event.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event(event_id):
    try:
        return Event.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_browsers():
    try:
        return EventBrowser.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_browser(event_id):
    try:
        return EventBrowser.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_documents():
    try:
        return EventDocument.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_document(event_id):
    try:
        return EventDocument.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_forms():
    try:
        return EventForm.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_form(event_id):
    try:
        return EventForm.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_locales():
    try:
        return EventLocale.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_locale(event_id):
    try:
        return EventLocale.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_sources():
    try:
        return EventSource.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_source(event_id):
    try:
        return EventSource.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_events_targets():
    try:
        return EventTarget.query.all()
    except Exception as e:
        logger.log_exception(e)
        raise Exception


def query_event_target(event_id):
    try:
        return EventTarget.query.filter_by(event_id).first()
    except Exception as e:
        logger.log_exception(e)
        raise Exception
import json

from magic_pixel import logger
from magic_pixel.db import db
from magic_pixel.models import (
    Event,
    EventBrowser,
    EventDocument,
    EventForm,
    EventLocale,
    EventSource,
    EventTarget,
)
from magic_pixel.lib.aws_sqs import event_queue
from magic_pixel.utility import parse_url
from flask import current_app


def _parse_event(event: dict) -> dict:
    return {
        "site_id": event.get("siteId"),
        "event_type": event.get("event"),
        "q_id": event.get("qId"),
        "fingerprint": event.get("fingerprint"),
        "session_id": event.get("sessionId"),
        "visitor_id": event.get("visitorId"),
        "user_id": event.get("userId"),
        "event_timestamp": event.get("timestamp"),
    }


def _parse_event_browser(event_id: str, event_browser: dict) -> dict:
    return {
        "event_id": event_id,
        "language": event_browser.get("language"),
        "name": event_browser.get("name"),
        "plugins": event_browser.get("plugins"),
        "ua": event_browser.get("ua"),
        "version": event_browser.get("version"),
        "screen_height": event_browser.get("height"),
        "screen_width": event_browser.get("width"),
        "screen_cd": event_browser.get("colorDepth"),
    }


def _parse_event_document(event_id: str, event_document: dict) -> dict:
    title = event_document.get("title")
    referrer_params = event_document.get("referrer")
    doc_params = event_document.get("url")
    referrer_url = parse_url(referrer_params) if referrer_params else None
    doc_url = parse_url(doc_params) if doc_params else None
    return {
        "event_id": event_id,
        "title": title,
        "document_url": doc_url,
        "document_parameters": doc_params,
        "referrer_url": referrer_url,
        "referral_parameters": referrer_params,
    }


def _parse_event_form(event_id: str, event_form: dict) -> dict:
    return {
        "event_id": event_id,
        "form_id": event_form.get("formId"),
        "form_fields": event_form.get("formFields"),
    }


def _parse_event_locale(event_id: str, event_locale: dict) -> dict:
    return {
        "event_id": event_id,
        "language": event_locale.get("language"),
        "tz_offset": event_locale.get("timezoneOffset"),
    }


def _parse_event_source(event_id: str, event_source: dict) -> dict:
    url_dict = event_source.get("url")
    url = parse_url(url_dict) if url_dict else None
    return {
        "event_id": event_id,
        "url": url,
        "parameters": event_source.get("parameters"),
    }


def _parse_event_target(event_id: str, event_target: dict) -> dict:
    url_dict = event_target.get("url")
    url = parse_url(url_dict) if url_dict else None
    return {
        "event_id": event_id,
        "url": url,
        "parameters": event_target.get("parameters"),
        "selector": event_target.get("selector"),
    }


def save_event(event: dict) -> dict:
    logger.log_info(f"save_event: {event}")
    try:
        new_event = Event(
            site_id=event["site_id"],
            event_type=event["event_type"],
            q_id=event["q_id"],
            fingerprint=event["fingerprint"],
            session_id=event["session_id"],
            visitor_id=event["visitor_id"],
            user_id=event["user_id"],
            event_timestamp=event["event_timestamp"],
        ).save()
        db.session.commit()
        return new_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_browser(event_browser: dict) -> bool:
    logger.log_info(f"save_event_browser: {event_browser}")
    try:
        new_event_browser = EventBrowser(
            event_id=event_browser["event_id"],
            language=event_browser["language"],
            name=event_browser["name"],
            plugins=event_browser["plugins"],
            ua=event_browser["ua"],
            version=event_browser["version"],
            screen_cd=event_browser["screen_cd"],
            screen_height=event_browser["screen_height"],
            screen_width=event_browser["screen_width"],
        ).save()
        return new_event_browser
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_document(event_document: dict) -> bool:
    logger.log_info(f"save_event_document: {event_document}")
    try:
        document_event = EventDocument(
            event_id=event_document["event_id"],
            title=event_document["title"],
            document_url=event_document["document_url"],
            document_parameters=event_document["document_parameters"],
            referrer_url=event_document["referrer_url"],
            referral_parameters=event_document["referral_parameters"],
        ).save()
        return document_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_form(event_form: dict) -> bool:
    logger.log_info(f"save_event_form: {event_form}")
    try:
        event_form = EventForm(
            event_id=event_form["event_id"],
            form_id=event_form["form_id"],
            form_fields=event_form["form_fields"],
        ).save()
        return event_form
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_locale(event_locale: dict) -> bool:
    logger.log_info(f"save_event_locale: {event_locale}")
    try:
        locale_event = EventLocale(
            event_id=event_locale["event_id"],
            language=event_locale["language"],
            tz_offset=event_locale["tz_offset"],
        ).save()
        return locale_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_source(event_source: dict) -> bool:
    logger.log_info(f"save_event_source: {event_source}")
    try:
        source_event = EventSource(
            event_id=event_source["event_id"],
            url=event_source["url"],
            parameters=event_source["parameters"],
        ).save()
        return source_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_target_message(event_target: dict) -> bool:
    logger.log_info(f"save_event_target_message: {event_target}")
    try:
        target_event = EventTarget(
            event_id=event_target["event_id"],
            url=event_target["url"],
            selector=event_target["selector"],
            parameters=event_target["parameters"],
        ).save()
        return target_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def queue_event_message(event: dict) -> bool:
    return event_queue.send_message(event)


def consume_event_message(event: dict) -> bool:
    # logger.log_info(f"consume_event_message: {event}")
    try:
        logger.log_info("saving new event...")
        parsed_event = _parse_event(event)
        new_event = save_event(parsed_event)

        event_browser = event.get("browser")
        event_screen = event.get("screen")
        if event_browser and event_screen:
            logger.log_info("parsing and saving new event browser...")
            parsed_browser_event = _parse_event_browser(
                new_event.id, {**event_browser, **event_screen}
            )
            save_event_browser(parsed_browser_event)

        event_document = event.get("document")
        if event_document:
            logger.log_info("parsing and saving new event document...")
            parsed_document_event = _parse_event_document(new_event.id, event_document)
            save_event_document(parsed_document_event)

        event_form = event.get("form")
        if event_form:
            logger.log_info("parsing and saving new event form...")
            parsed_form_event = _parse_event_form(new_event.id, event_form)
            save_event_form(parsed_form_event)

        event_locale = event.get("locale")
        if event_locale:
            logger.log_info("parsing and saving new event locale...")
            parsed_locale_event = _parse_event_locale(new_event.id, event_locale)
            save_event_locale(parsed_locale_event)

        event_source = event.get("source")
        if event_source:
            logger.log_info("parsing and saving new event source...")
            parsed_source_event = _parse_event_source(new_event.id, event_source)
            save_event_source(parsed_source_event)

        event_target = event.get("target")
        if event_target:
            logger.log_info("parsing and saving new event target...")
            parsed_target_event = _parse_event_target(new_event.id, event_target)
            save_event_target_message(parsed_target_event)
        db.session.commit()
        logger.log_info('New event saved')
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


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

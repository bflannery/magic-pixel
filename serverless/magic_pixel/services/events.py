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
            site_id=event.get("siteId"),
            event_type=event.get("event"),
            q_id=event.get("qId"),
            fingerprint=event.get("fingerprint"),
            session_id=event.get("sessionId"),
            visitor_id=event.get("visitorId"),
            user_id=event.get("userId"),
            event_timestamp=event.get("timestamp"),
        ).save()
        db.session.commit()
        logger.log_info(f"event: {new_event}")
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
        logger.log_info(f"browser event: {new_event_browser}")
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
        logger.log_info(f"document event: {document_event}")
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
        logger.log_info(f"form event: {event_form}")
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
        logger.log_info(f"locale event: {locale_event}")
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
        logger.log_info(f"source event: {source_event}")
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
        logger.log_info(f"target event: {target_event}")
        return target_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def queue_event_message(event: dict) -> bool:
    return event_queue.send_message(event)


def consume_event_message(event: dict) -> bool:
    # logger.log_info(f"consume_event_message: {event}")
    try:
        new_event = save_event(event)

        event_browser = event.get("browser")
        event_screen = event.get("screen")
        if event_browser and event_screen:
            browser_event = _parse_event_browser(
                new_event.id, {**event_browser, **event_screen}
            )
            save_event_browser(browser_event)

        event_document = event.get("document")
        if event_document:
            document_event = _parse_event_document(new_event.id, event_document)
            save_event_document(document_event)

        event_form = event.get("form")
        if event_form:
            form_event = _parse_event_form(new_event.id, event_form)
            save_event_form(form_event)

        event_locale = event.get("locale")
        if event_locale:
            locale_event = _parse_event_locale(new_event.id, event_locale)
            save_event_locale(locale_event)

        event_source = event.get("source")
        if event_source:
            source_event = _parse_event_source(new_event.id, event_source)
            save_event_source(source_event)

        event_target = event.get("target")
        if event_target:
            target_event = _parse_event_target(new_event.id, event_target)
            save_event_target_message(target_event)
        db.session.commit()
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

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


def queue_event_message(event: dict) -> bool:
    return event_queue.send_message(event)


def _parse_event_browser(event_id: str, event_browser: dict, event_screen: dict) -> dict:
    return {
        "event_id": event_id,
        "language": event_browser.get("language"),
        "name": event_browser.get("name"),
        "plugins": event_browser.get("plugins"),
        "ua": event_browser.get("ua"),
        "version": event_browser["version"].get("version"),
        "screen_height": event_screen.get("height"),
        "screen_width": event_screen.get("width"),
        "screen_cd": event_screen.get("colorDepth"),
    }


def _parse_event_document(event_id: str, event_document: dict) -> dict:
    title = event_document.get("title")
    referrer_dict = event_document.get("referrer")
    url_dict = event_document.get("url")
    referrer = parse_url(referrer_dict) if referrer_dict else None
    url = parse_url(url_dict) if url_dict else None
    return {
        "event_id": event_id,
        "title": title,
        "referrer": referrer,
        "document_url": url,
        "document_parameters": None,  # TODO: Find where this is in scribe
        "referral_parameters": None,  # TODO: Find where this is in scribe
    }


def _parse_event_form(event_id: str, event_form: dict) -> dict:
    return {
        "event_id": event_id,
        "form_id": event_form.get("formId"),
        "form_fields": event_form.get("formFields"),
    }


def _parse_event_locale(event_id: str, event_locale: dict) -> dict:
    return  {
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
    }


def consume_event_message(event: dict) -> bool:
    logger.log_info(f"consume_event_message: {event}")
    try:
        new_event = save_event(event)

        event_browser = event.get("browser")
        event_screen = event.get("screen")
        if event_browser and event_screen:
            browser_event = _parse_event_browser(
                new_event.id, event_browser, event_screen
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
            source_event = _parse_event_target(new_event.id, event_target)
            save_event_target_message(source_event)
        db.session.commit()
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


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
            title=event_document["title"],
            referrer=event_document["referrer"],
            document_url=event_document["url"],
            document_parameters=event_document["document_parameters"],
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
            url=event_target["url"],
            selector=event_target["selector"],
            parameters=event_target["parameters"],
        ).save()
        logger.log_info(f"target event: {target_event}")
        return target_event
    except Exception as e:
        logger.log_exception(e)
        raise e

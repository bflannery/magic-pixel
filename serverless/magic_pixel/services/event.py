from typing import Dict, Optional

from magic_pixel import logger
from magic_pixel.db import db
from magic_pixel.models import (
    Event,
    EventBrowser,
    EventDocument,
    EventLocale,
    EventSource,
    EventTarget,
    EventForm,
)
from magic_pixel.lib.aws_sqs import event_queue
from magic_pixel.utility import parse_url
from magic_pixel.models.account import AccountSite


def _parse_event(event: Dict) -> Optional[Dict]:
    account_site_id = event.get("accountSiteId")
    if not account_site_id:
        raise Exception(f"Event does not have an account site id.")
    account_site = AccountSite.get_by_mp_id(account_site_id)
    if not account_site:
        raise Exception(f"No account site exists with site id {account_site_id}.")
    return {
        "created_at": event.get("timestamp"),
        "account_site_id": account_site.id,
        "user_id": event.get("userId"),
        "session_id": event.get("sessionId"),
        "fingerprint": event.get("fingerprint"),
        "type": event.get("type"),
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


def _parse_event_form(event_id: str, event_form: dict) -> dict:
    return {
        "event_id": event_id,
        "form_id": event_form.get("formId"),
        "form_fields": event_form.get("formFields"),
    }


def save_event(event: dict):
    try:
        new_event = Event(
            created_at=event["created_at"],
            account_site_id=event["account_site_id"],
            user_id=event["user_id"],
            session_id=event["session_id"],
            fingerprint=event["fingerprint"],
            type=event["type"],
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


def save_event_form_message(event_id, event_form):
    logger.log_info(f"save_event_form: {event_form}")
    try:
        event_form = EventForm(
            event_id=event_form["event_id"],
            form_id=event_form["form_id"],
            form_type=event_form["form_type"],
            form_fields=event_form["form_fields"],
        ).save()
        db.session.commit()
        return event_form
    except Exception as e:
        logger.log_exception(e)
        raise e


def queue_event_ingestion(event: dict) -> bool:
    return event_queue.send_message(event)


def backup_event(event):
    pass


def ingest_event_details(event, db_event_id):
    event_browser = event.get("browser")
    event_screen = event.get("screen")

    # Breakdown event
    # TODO: We could split these into unique SQS queues at this point to
    # Reduce load on this single ingestion lambda
    if event_browser and event_screen:
        logger.log_info("parsing and saving new event browser...")
        parsed_browser_event = _parse_event_browser(
            db_event_id, {**event_browser, **event_screen}
        )
        save_event_browser(parsed_browser_event)

    event_document = event.get("document")
    if event_document:
        logger.log_info("parsing and saving new event document...")
        parsed_document_event = _parse_event_document(db_event_id, event_document)
        save_event_document(parsed_document_event)

    event_locale = event.get("locale")
    if event_locale:
        logger.log_info("parsing and saving new event locale...")
        parsed_locale_event = _parse_event_locale(db_event_id, event_locale)
        save_event_locale(parsed_locale_event)

    event_source = event.get("source")
    if event_source:
        logger.log_info("parsing and saving new event source...")
        parsed_source_event = _parse_event_source(db_event_id, event_source)
        save_event_source(parsed_source_event)

    event_target = event.get("target")
    if event_target:
        logger.log_info("parsing and saving new event target...")
        parsed_target_event = _parse_event_target(db_event_id, event_target)
        save_event_target_message(parsed_target_event)
    db.session.commit()

    event_form = event.get("form")
    if event_form:
        logger.log_info("parsing and saving new event form...")
        parsed_locale_event = _parse_event_form(db_event_id, event_form)
        save_event_locale(parsed_locale_event)


def ingest_event_message(event) -> bool:
    logger.log_info(f"ingest_event_message: {event}")
    try:
        # Parse event
        parsed_event = _parse_event(event)
        # Create new event
        new_event = save_event(parsed_event)
        ingest_event_details(event, new_event.id)

        logger.log_info("New event saved")
        return True
    except Exception as e:
        logger.log_exception(e)
        return False

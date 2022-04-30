from typing import Dict, Optional

from server import logger
from server.db import db
from server.models import (
    AccountSite,
    Event,
    EventBrowser,
    EventDocument,
    EventForm,
    EventLocale,
    EventSource,
    EventTarget,
)
from server.lib.aws_sqs import event_queue
from server.utility import parse_url


def parse_event(event: Dict) -> Optional[Dict]:
    print(f"Parse Event: {event}")
    account_site_id = event.get("accountSiteId")
    if not account_site_id:
        raise Exception(f"Event does not have an account site id.")
    account_site = AccountSite.get_by_mp_id(account_site_id)
    if not account_site:
        raise Exception(f"No account site exists with site id {account_site_id}.")

    parsed_event = {
        "created_at": event.get("timestamp"),
        "account_site_id": account_site.id,
        "visitor_uuid": event.get("visitorUUID"),
        "distinct_person_id": event.get("distinctPersonId"),
        "session_id": event.get("sessionId"),
        "fingerprint": event.get("fingerprint"),
        "type": event.get("type"),
    }

    event_browser = event.get("browser")
    event_screen = event.get("screen")
    if event_browser and event_screen:
        parsed_event["browser"] = _parse_event_browser(
            {**event_browser, **event_screen}
        )

    event_document = event.get("document")
    if event_document:
        parsed_event["document"] = _parse_event_document(event_document)

    event_locale = event.get("locale")
    if event_locale:
        parsed_event["locale"] = _parse_event_locale(event_locale)

    event_source = event.get("source")
    if event_source:
        parsed_event["source"] = _parse_event_source(event_source)

    event_target = event.get("target")
    if event_target:
        parsed_event["target"] = _parse_event_target(event_target)

    event_form = event.get("form")
    if event_form:
        parsed_event["form"] = _parse_event_form(event_form)

    return parsed_event


def _parse_event_browser(event_browser: dict) -> dict:
    return {
        "browser_name": event_browser.get("name"),
        "plugins": event_browser.get("plugins"),
        "ua": event_browser.get("ua"),
        "version": event_browser.get("version"),
        "screen_height": event_browser.get("height"),
        "screen_width": event_browser.get("width"),
        "screen_cd": event_browser.get("colorDepth"),
    }


def _parse_event_document(event_document: dict) -> dict:
    title = event_document.get("title")
    referrer_params = event_document.get("referrer")
    doc_params = event_document.get("url")
    referrer_url = parse_url(referrer_params) if referrer_params else None
    doc_url = parse_url(doc_params) if doc_params else None
    return {
        "title": title,
        "document_url": doc_url,
        "document_parameters": doc_params,
        "referrer_url": referrer_url,
        "referral_parameters": referrer_params,
    }


def _parse_event_locale(event_locale: dict) -> dict:
    return {
        "language": event_locale.get("language"),
        "tz_offset": event_locale.get("timezoneOffset"),
    }


def _parse_event_source(event_source: dict) -> dict:
    url_dict = event_source.get("url")
    url = parse_url(url_dict) if url_dict else None
    return {
        "url": url,
        "parameters": event_source.get("parameters"),
    }


def _parse_event_target(event_target: dict) -> dict:
    url_dict = event_target.get("url")
    url = parse_url(url_dict) if url_dict else None
    return {
        "url": url,
        "parameters": event_target.get("parameters"),
        "selector": event_target.get("selector"),
    }


def _parse_event_form(event_form: dict) -> dict:
    return {
        "form_id": event_form.get("formId"),
        "form_fields": event_form.get("formFields"),
    }


def save_event_browser(event: Event, event_browser: dict) -> bool:
    try:
        new_event_browser = EventBrowser(
            event=event,
            browser_name=event_browser["browser_name"],
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


def save_event_document(event: Event, event_document: dict) -> bool:
    try:
        document_event = EventDocument(
            event=event,
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


def save_event_locale(event: Event, event_locale: dict) -> bool:
    try:
        locale_event = EventLocale(
            event=event,
            language=event_locale["language"],
            tz_offset=event_locale["tz_offset"],
        ).save()
        return locale_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_source(event: Event, event_source: dict) -> bool:
    try:
        source_event = EventSource(
            event=event,
            url=event_source["url"],
            parameters=event_source["parameters"],
        ).save()
        return source_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_target(event: Event, event_target: dict) -> bool:
    try:
        target_event = EventTarget(
            event=event,
            url=event_target["url"],
            selector=event_target["selector"],
            parameters=event_target["parameters"],
        ).save()
        return target_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event_form(event: Event, event_form: dict):
    try:
        event_form = EventForm(
            event=event,
            form_id=event_form["form_id"],
            form_fields=event_form["form_fields"],
        ).save()
        db.session.commit()
        return event_form
    except Exception as e:
        logger.log_exception(e)
        raise e


def save_event(event: dict):
    try:
        event_browser = event.get("browser")
        event_document = event.get("document")
        event_locale = event.get("locale")
        event_source = event.get("source")
        event_target = event.get("target")
        event_form = event.get("form")

        new_event = Event(
            created_at=event["created_at"],
            account_site_id=event["account_site_id"],
            distinct_person_id=event["distinct_person_id"],
            visitor_uuid=event["visitor_uuid"],
            session_id=event["session_id"],
            fingerprint=event["fingerprint"],
            type=event["type"],
        ).save()
        if event_browser:
            save_event_browser(new_event, event_browser)
        if event_locale:
            save_event_locale(new_event, event_locale)
        if event_document:
            save_event_document(new_event, event_document)
        if event_source:
            save_event_source(new_event, event_source)
        if event_target:
            save_event_target(new_event, event_target)
        if event_form:
            save_event_form(new_event, event_form)

        db.session.commit()
        return new_event
    except Exception as e:
        logger.log_exception(e)
        raise e


def ingest_event_message(event) -> bool:
    logger.log_info(f"ingest_event_message: {event}")
    try:
        # Parse event
        parsed_event = parse_event(event)
        # Create new event
        new_event = save_event(parsed_event)
        logger.log_info(f"New event {new_event} saved")
        return True
    except Exception as e:
        logger.log_exception(e)
        return False


def queue_event_ingestion(event: dict) -> bool:
    return event_queue.send_message(event)

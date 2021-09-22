import json

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
from magic_pixel.utilities import parse_url


def queue_event_message(event):
    return event_queue.send_message(event)


def consume_event_message(sqs_id: str, record: dict) -> bool:
    body_string = record.get("body")
    message = json.loads(body_string)
    print(f"consume event message_id: {sqs_id}")
    result = save_event_message(message)
    return result


def save_event_message(event):
    print(f"save_event_message: {event}")
    try:
        new_event = save_event(event)

        event_browser = event.get("browser")
        event_screen = event.get("screen")
        if event_browser and event_screen:
            browser_event = {
                "event_id": new_event.id,
                "language": event_browser.get("language"),
                "name": event_browser.get("name"),
                "plugins": event_browser.get("plugins"),
                "ua": event_browser.get("ua"),
                "version": event["version"].get("version"),
                "screen_height": event["screen"].get("height"),
                "screen_width": event["screen"].get("width"),
                "screen_cd": event["screen"].get("colorDepth"),
            }
            save_event_browser(browser_event)

        event_document = event.get("document")
        if event_document:
            title = event_document.get("title")
            referrer_dict = event_document.get("referrer")
            url_dict = event_document.get("url")
            referrer = parse_url(referrer_dict) if referrer_dict else None
            url = parse_url(url_dict) if url_dict else None
            document_event = {
                "event_id": event.id,
                "title": title,
                "referrer": referrer,
                "document_url": url,
                "document_parameters": None,  # TODO: Find where this is in scribe
                "referral_parameters": None,  # TODO: Find where this is in scribe
            }

            save_event_document(document_event)

        event_form = event.get("form")
        if event_form:
            form_event = {
                "event_id": event.id,
                "form_id": event_form.get("formId"),
                "form_fields": event_form.get("formFields"),
            }

            save_event_form(form_event)

        event_locale = event.get("locale")
        if event_locale:
            locale_event = {
                "event_id": event.id,
                "language": event_locale.get("language"),
                "tz_offset": event_locale.get("timezoneOffset"),
            }

            save_event_locale(locale_event)

        event_source = event.get("source")
        if event_source:
            url_dict = event_source.get("url")
            url = parse_url(url_dict) if url_dict else None
            source_event = {
                "event_id": event.id,
                "url": url,
                "parameters": event_source.get("parameters"),
            }

            save_event_source(source_event)

        event_target = event.get("target")
        if event_target:
            url_dict = event_target.get("url")
            url = parse_url(url_dict) if url_dict else None
            source_event = {
                "event_id": event.id,
                "url": url,
                "parameters": event_target.get("parameters"),
            }

            save_event_target_message(source_event)

        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event(event):
    print(f"save_event: {event}")
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
        print(f"New Event: {new_event}")
        return new_event
    except Exception as e:
        print(e)
        return False


def save_event_browser(event_browser):
    print(f"save_event_browser: {event_browser}")
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
        print(f"New Browser Event: {new_event_browser}")
        return new_event_browser
    except Exception as e:
        print(e)
        return False


def save_event_document(event_document):
    print(f"save_event_document: {event_document}")
    try:
        new_document_event = EventDocument(
            title=event_document["title"],
            referrer=event_document["referrer"],
            document_url=event_document["url"],
            document_parameters=event_document["document_parameters"],
            referral_parameters=event_document["referral_parameters"],
        ).save()
        print(f"New Document Event: {new_document_event}")
        return new_document_event
    except Exception as e:
        print(e)
        return False


def save_event_form(event_form):
    print(f"save_event_form: {event_form}")
    try:
        new_event_form = EventForm(
            form_id=event_form["form_id"],
            form_fields=event_form["form_fields"],
        ).save()
        print(f"New Form Event: {new_event_form}")
        return new_event_form
    except Exception as e:
        print(e)
        return False


def save_event_locale(event_locale):
    print(f"save_event_locale: {event_locale}")
    try:
        new_locale_event = EventLocale(
            language=event_locale["language"],
            tz_offset=event_locale["tz_offset"],
        ).save()
        print(f"New Locale Event: {new_locale_event}")
        return new_locale_event
    except Exception as e:
        print(e)
        return False


def save_event_source(event_source):
    print(f"save_event_source: {event_source}")
    try:
        new_source_event = EventSource(
            url=event_source["url"],
            parameters=event_source["parameters"],
        ).save()
        print(f"New Source Event: {new_source_event}")
        return new_source_event
    except Exception as e:
        print(e)
        return False


def save_event_target_message(event_target):
    print(f"save_event_target_message: {event_target}")
    try:
        new_target_event = EventTarget(
            url=event_target["url"],
            selector=event_target["selector"],
            parameters=event_target["parameters"],
        ).save()
        print(f"New Target Event: {new_target_event}")
        return new_target_event
    except Exception as e:
        print(e)
        return False

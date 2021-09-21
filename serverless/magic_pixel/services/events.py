from magic_pixel.db import db

from magic_pixel.models import Event
from magic_pixel.models.event_browser import EventBrowser
from magic_pixel.models.event_document import EventDocument
from magic_pixel.models.event_form import EventForm
from magic_pixel.models.event_locale import EventLocale
from magic_pixel.models.event_source import EventSource
from magic_pixel.models.event_target import EventTarget


def parse_url(url_dict):
    return f"{url_dict.protocol}//{url_dict.host}{url_dict.pathname}"


def save_event_message(event):
    print("save_event_message: ", event)
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
    print("save_event: ", event)
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
        return new_event
    except Exception as e:
        print(e)
        return False


def save_event_browser(event_browser):
    print("save_event_browser: ", event_browser)
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
        print("New Browser Event: ", new_event_browser)
        return new_event_browser
    except Exception as e:
        print(e)
        return False


def save_event_document(event_document):
    print("save_event_document: ", event_document)
    try:
        new_document_event = EventDocument(
            title=event_document["title"],
            referrer=event_document["referrer"],
            document_url=event_document["url"],
            document_parameters=event_document["document_parameters"],
            referral_parameters=event_document["referral_parameters"],
        ).save()
        print("New Document Event: ", new_document_event)
        return new_document_event
    except Exception as e:
        print(e)
        return False


def save_event_form(event_form):
    print("save_event_form: ", event_form)
    try:
        new_event_form = EventForm(
            form_id=event_form["form_id"],
            form_fields=event_form["form_fields"],
        ).save()
        print("New Form Event: ", new_event_form)
        return new_event_form
    except Exception as e:
        print(e)
        return False


def save_event_locale(event_locale):
    print("save_event_locale: ", event_locale)
    try:
        new_locale_event = EventLocale(
            language=event_locale["language"],
            tz_offset=event_locale["tz_offset"],
        ).save()
        print("New Locale Event: ", new_locale_event)
        return new_locale_event
    except Exception as e:
        print(e)
        return False


def save_event_source(event_source):
    print("save_event_source")
    try:
        new_source_event = EventSource(
            url=event_source["url"],
            parameters=event_source["parameters"],
        ).save()
        print("New Source Event: ", new_source_event)
        return new_source_event
    except Exception as e:
        print(e)
        return False


def save_event_target_message(event_target):
    print("save_event_target_message")
    try:
        new_target_event = EventTarget(
            url=event_target["url"],
            selector=event_target["selector"],
            parameters=event_target["parameters"],
        ).save()
        print("New Target Event: ", new_target_event)
        return new_target_event
    except Exception as e:
        print(e)
        return False

from magic_pixel.lib.messages import (
    EventBrowserMessage,
    EventDocumentMessage,
    EventFormMessage,
    EventLocaleMessage,
    EventMessage,
    EventSourceMessage,
    EventTargetMessage,
)

# from magic_pixel.models import Event


def save_event_message(event_message: EventMessage):
    print("save_event_message")
    try:
        # new_event = Event()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_browser_message(event_browser_message: EventBrowserMessage):
    print("save_event_browser_message")
    try:
        # new_event = EventBrowser()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_document_message(event_document_message: EventDocumentMessage):
    print("save_event_document_message")
    try:
        # new_event = EventDocument()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_form_message(event_form_message: EventFormMessage):
    print("save_event_form_message")
    try:
        # new_event = EventForm()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_locale_message(event_locale_message: EventLocaleMessage):
    print("save_event_locale_message")
    try:
        # new_event = EventLocale()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_source_message(event_source_message: EventSourceMessage):
    print("save_event_source_message")
    try:
        # new_event = EventSource()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def save_event_target_message(event_target_message: EventTargetMessage):
    print("save_event_target_message")
    try:
        # new_event = EventTarget()
        # print('New Event: ', new_event)
        # db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False

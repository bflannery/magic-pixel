from flask import jsonify
from flask_cors import cross_origin

from magic_pixel.api import api_routes
from magic_pixel.services.event import (
    query_events,
    query_event,
    query_events_documents,
    query_event_document,
    query_events_browsers,
    query_event_browser,
    query_events_forms,
    query_event_form,
    query_events_locales,
    query_event_locale,
    query_events_sources,
    query_event_source,
    query_events_targets,
    query_event_target,
)


@api_routes.route("/events", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events():
    events = query_events()
    return jsonify({"result": events})


@api_routes.route("/events/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event(id):
    event = query_event(id)
    if not event:
        return f"No event found with event id {id}", 404
    return jsonify({"result": event})


@api_routes.route("/events-browsers", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_browsers():
    events_browsers = query_events_browsers()
    return jsonify({"result": events_browsers})


@api_routes.route("/events-browsers/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_browser(id):
    event_browser = query_event_browser(id)
    if not event_browser:
        return f"No event browser found with event id {id}", 404
    return jsonify({"result": event_browser})


@api_routes.route("/events-documents", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_documents():
    events_documents = query_events_documents()
    return jsonify({"result": events_documents})


@api_routes.route("/events-documents/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_document(id):
    events_document = query_event_document(id)
    if not events_document:
        return f"No event document found with event id {id}", 404
    return jsonify({"result": events_document})


@api_routes.route("/events-forms", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_forms():
    events_forms = query_events_forms()
    return jsonify({"result": events_forms})


@api_routes.route("/events-forms/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_form(id):
    event_form = query_event_form(id)
    if not event_form:
        return f"No event form found with event id {id}", 404
    return jsonify({"result": event_form})


@api_routes.route("/events-locales", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_locales():
    events_locales = query_events_locales()
    return jsonify({"result": events_locales})


@api_routes.route("/events-locales/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_locale(id):
    event_locale = query_event_locale(id)
    if not event_locale:
        return f"No event locale found with event id {id}", 404
    return jsonify({"result": event_locale})


@api_routes.route("/events-sources", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_sources():
    events_sources = query_events_sources()
    return jsonify({"result": events_sources})


@api_routes.route("/events-sources/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_source(id):
    event_source = query_event_source(id)
    if not event_source:
        return f"No event source found with event id {id}", 404
    return jsonify({"result": event_source})


@api_routes.route("/events-targets", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events_targets():
    events_targets = query_events_targets()
    return jsonify({"result": events_targets})


@api_routes.route("/events-targets/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event_target(id):
    event_target = query_event_target(id)
    if not event_target:
        return f"No event target found with event id {id}", 404
    return jsonify({"result": event_target})

import requests
from flask import Blueprint, jsonify
from flask_cors import cross_origin
from magic_pixel.db import db
from magic_pixel.services.events import query_events, query_event

api_routes = Blueprint("api", __name__, url_prefix="/api")


@api_routes.route("/health_check", methods=["GET"])
def api_health_check():
    now = db.session.query("now()").scalar()
    response = requests.get("https://www.google.com")
    return jsonify(
        {
            "now": now,
            "response_code": response.status_code,
        }
    )


@api_routes.route("/events", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_events():
    try:
        events = query_events()
        return jsonify({"result": events})
    except Exception as e:
        return jsonify(
            {"error": "Oopps. There was an error when trying to get all events"}
        )


@api_routes.route("/events/<int:id>", methods=["GET"])
@cross_origin(origins="*", supports_credentials=True)
def get_event(id):
    try:
        event = query_event(id)
        if not event:
            return f"No event found with event id {id}", 404
        return jsonify({"result": event})
    except Exception as e:
        return jsonify(
            {"error": "Oopps. There was an error when trying to get all events"}
        )

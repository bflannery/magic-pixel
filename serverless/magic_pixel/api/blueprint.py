import requests
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from magic_pixel.db import db
from ..lib.messages import EventMessage
from ..services.messages import publish_event_message

api_blueprint = Blueprint("api", __name__, url_prefix="/api")


@api_blueprint.route("/health_check", methods=["GET"])
def api_health_check():
    now = db.session.query("now()").scalar()
    response = requests.get("https://www.google.com")
    return jsonify(
        {
            "now": now,
            "response_code": response.status_code,
        }
    )


@api_blueprint.route("/send-event", methods=["POST"])
@cross_origin(origins="*", supports_credentials=True)
def send_event():
    data = request.get_json()
    event = data["data"]
    print('Event:', event)
    event_message = EventMessage(**event)
    print('Event Message:', event_message)
    publish_event_message(event_message)
    # Get event from DB
    return jsonify({"result": "success"})


import requests
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin

from lambdas import send_event
from magic_pixel.db import db

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


@api_routes.route("/send-event", methods=["POST"])
@cross_origin(origins="*", supports_credentials=True)
def publish_event():
    data = request.get_json()
    send_event(data["data"])
    return jsonify({"result": "success"})

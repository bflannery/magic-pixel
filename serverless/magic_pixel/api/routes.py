import requests
from flask import Blueprint, jsonify
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
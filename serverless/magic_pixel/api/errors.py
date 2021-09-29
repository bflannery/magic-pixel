import json
from typing import Dict
from flask import jsonify, make_response
from werkzeug.exceptions import HTTPException
from magic_pixel import logger
from .routes import api_routes
from werkzeug.exceptions import BadRequest


class ValidationError(BadRequest):
    def __init__(self, messages: Dict[str, str], *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.messages = messages


# Turn all exceptions into json
@api_routes.errorhandler(Exception)
def handle_error(e):
    logger.log_exception(e)
    return make_response(jsonify({"error": "internal error"})), 500


@api_routes.errorhandler(500)
def handle_internal_error(e):
    logger.log_exception(e)
    return make_response(jsonify({"error": "internal error"})), 500


# Add more data for known http exceptions (ones that map to status codes)
@api_routes.errorhandler(HTTPException)
def handle_http_error(e):
    response = e.get_response()
    data = {
        "code": e.code,
        "name": e.name,
        "description": e.description,
    }
    # Show errors from ValidationError type
    validation_errors = getattr(e, "messages", None)
    if validation_errors:
        data["errors"] = validation_errors
    response.data = json.dumps(data)
    response.content_type = "application/json"
    return response

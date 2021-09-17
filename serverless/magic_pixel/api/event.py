from flask import jsonify, request
from flask_cors import cross_origin
from .blueprint import api_blueprint
from ..lib.messages import EventMessage
from ..services.messages import publish_event_message


@api_blueprint.route("/dev/send-event", methods=["POST"])
@cross_origin(origins="*", supports_credentials=True)
def send_event(data):
    data = request.get_json()
    message = data["message"]
    print('Message:', message)
    event_message = EventMessage(**message)
    print('Event Message:', event_message)
    publish_event_message(event_message)
    # Get event from DB
    return jsonify({"result": "success"})

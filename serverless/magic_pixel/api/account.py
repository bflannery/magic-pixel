from flask import (
    jsonify,
    request,
    make_response,
)
from flask_cors import cross_origin
from magic_pixel.api import api_routes
from magic_pixel.services.account import create_new_account


@api_routes.route("/accounts", methods=["POST"])
@cross_origin(origins="*")
def api_register():
    data = request.get_json()
    result = create_new_account(data.name)
    resp = make_response(jsonify({"result": result}))
    return resp

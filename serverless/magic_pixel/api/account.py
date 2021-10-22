from flask import (
    jsonify,
    request,
    make_response,
)
from flask_cors import cross_origin
from magic_pixel.api import api_routes
from magic_pixel.services.account import create_new_account
from magic_pixel.services.user import create_new_user


@api_routes.route("/accounts", methods=["POST"])
@cross_origin(origins="*")
def create_account():
    data = request.get_json()
    result = create_new_account(data.name)
    resp = make_response(jsonify({"result": result}))
    return resp


@api_routes.route("/users", methods=["POST"])
@cross_origin(origins="*")
def create_user():
    data = request.get_json()
    fist_name = data.name
    last_name = data.name
    email = data.name
    roles = data.get('roles')
    new_user = create_new_user(fist_name, last_name, email, roles)
    resp = make_response(jsonify({"result": new_user}))
    return resp

import logging
from flask import Flask
from flask_cors import CORS

from magic_pixel import api, auth, utility
from magic_pixel.db import db, migrate
from magic_pixel.graphql import graphql_view

if logging.getLogger().hasHandlers():
    logging.getLogger().setLevel(logging.INFO)
else:
    logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

app.config.from_pyfile("config/config.py")

if utility.is_local():
    app.config.from_pyfile("config/config.local.py")
else:
    env = utility.env()
    app.config.from_pyfile(f"config.{env}.py")

CORS(app)

auth.init_app(app)
db.init_app(app)
migrate.init_app(app, db)
api.init_app(app)

app.add_url_rule("/graphql", view_func=graphql_view)

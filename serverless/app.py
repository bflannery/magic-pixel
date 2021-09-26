import logging
from flask import Flask
from flask_cors import CORS

from magic_pixel import api, utility
from magic_pixel.db import db, migrate

if logging.getLogger().hasHandlers():
    logging.getLogger().setLevel(logging.INFO)
else:
    logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

app.config.from_pyfile("config.py")

if utility.is_local():
    app.config.from_pyfile("config.local.py")

CORS(app)

db.init_app(app)
migrate.init_app(app, db)
api.init_app(app)

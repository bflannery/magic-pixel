import logging
from flask import Flask
from flask_cors import CORS

from server import utility
from server.db import db, migrate

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
    # TODO: Add env config files when ready to deploy
    app.config.from_pyfile(f"config.{env}.py")

CORS(app)

db.init_app(app)
migrate.init_app(app, db)
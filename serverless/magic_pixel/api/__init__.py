from .routes import api_routes
from . import account, events


def init_app(app):
    app.register_blueprint(api_routes)

from .routes import api_routes


def init_app(app):
    app.register_blueprint(api_routes)

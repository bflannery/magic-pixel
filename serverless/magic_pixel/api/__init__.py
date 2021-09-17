from .blueprint import api_blueprint


def init_app(app):
    app.register_blueprint(api_blueprint)

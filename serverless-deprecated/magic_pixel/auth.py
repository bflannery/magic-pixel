from werkzeug.exceptions import BadRequest
from flask_login import LoginManager

from magic_pixel.models import User
from magic_pixel.services import user as user_service

login_manager = LoginManager()
login_manager.session_protection = "strong"


def get_token_from_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""

    auth = request.headers.get("Authorization", None)
    if not auth:
        return None

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise BadRequest("Authorization header must start with Bearer")
    elif len(parts) == 1:
        raise BadRequest("Token not found.")
    elif len(parts) > 2:
        raise BadRequest("Authorization header must be Bearer token.")

    token = parts[1]
    return token


@login_manager.request_loader
def load_user_from_request(request):
    token = get_token_from_auth_header(request)
    if not token:
        return None
    user = user_service.get_auth0_user_from_token(token)
    return user


@login_manager.user_loader
def load_user(id):
    user = User.query.filter_by(session=id, deleted_at=None).first()
    return user


def init_app(app):
    login_manager.init_app(app)

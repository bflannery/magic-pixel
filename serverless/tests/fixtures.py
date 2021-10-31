from datetime import datetime

import pytest
from os import path
from app import app as _app
from magic_pixel.constants import UserRoleType
from magic_pixel.db import db as _db
from flask_migrate import upgrade

from tests.factories import (
    EventFactory,
    EventSourceFactory,
    EventBrowserFactory,
    EventDocumentFactory,
    EventLocaleFactory,
    UserFactory,
)
from tests.factories.role_factory import RoleFactory


@pytest.fixture(scope="session", autouse=True)
def app():
    db_url = _app.config["SQLALCHEMY_DATABASE_URI"]
    assert "prod" not in db_url
    assert "localhost" in db_url or "127.0.0.1" in db_url or "pg-test" in db_url
    # TODO: remove when table is removed
    with _app.test_request_context():
        _db.drop_all()
        _db.engine.execute("DROP TABLE IF EXISTS alembic_version")
        upgrade(path.join(_app.root_path, "migrations"))
    yield _app


@pytest.fixture(scope="session")
def db():
    return _db


@pytest.fixture
def test_client(app):
    return app.test_client()


@pytest.fixture
def roles():
    main_role = RoleFactory(name=UserRoleType.MAIN.value)
    admin_role = RoleFactory(name=UserRoleType.ADMIN.value)
    owner_role = RoleFactory(name=UserRoleType.OWNER.value)
    return (main_role, admin_role, owner_role)


@pytest.fixture
def pageview_event():
    event = EventFactory(
        site_id="random_site_id", event_type="pageview", event_timestamp=datetime.now()
    )
    EventBrowserFactory(event=event)
    EventDocumentFactory(event=event)
    EventLocaleFactory(event=event)
    EventSourceFactory(event=event)


@pytest.fixture
def logged_in_user(app, roles):
    current_user = UserFactory(roles=(roles[0],))
    current_user.save()

    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request(request):
            return current_user

    yield current_user
    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request_reset(request):
            return None


@pytest.fixture
def logged_in_brand_new_user(app, roles):
    current_user = UserFactory(roles=(roles[0],), account=None)
    current_user.save()

    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request(request):
            return current_user

    yield current_user
    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request_reset(request):
            return None


@pytest.fixture
def logged_in_admin(app, roles):
    current_user = UserFactory(
        roles=(
            roles[0],
            roles[1],
        )
    )
    current_user.save()

    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request(request):
            return current_user

    yield current_user
    with app.test_request_context():

        @app.login_manager.request_loader
        def load_user_from_request_reset(request):
            return None

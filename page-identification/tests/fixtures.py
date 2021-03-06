from datetime import datetime
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.schema import DropConstraint, DropTable, MetaData, Table

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
    AccountFactory,
)
from tests.factories.account_site_factory import AccountSiteFactory
from tests.factories.role_factory import RoleFactory


@pytest.fixture(scope="session", autouse=True)
def app():
    db_url = _app.config["SQLALCHEMY_DATABASE_URI"]
    assert "prod" not in db_url
    assert "localhost" in db_url or "127.0.0.1" in db_url or "pg-test" in db_url
    # TODO: remove when table is removed
    with _app.test_request_context():
        inspector = Inspector.from_engine(_db.engine)
        meta = MetaData()
        tables = []
        all_fkeys = []

        for table_name in inspector.get_table_names():
            fkeys = []

            for fkey in inspector.get_foreign_keys(table_name):
                if not fkey["name"]:
                    continue

                fkeys.append(_db.ForeignKeyConstraint((), (), name=fkey["name"]))

            tables.append(Table(table_name, meta, *fkeys))
            all_fkeys.extend(fkeys)

        for fkey in all_fkeys:
            _db.engine.execute(DropConstraint(fkey))

        for table in tables:
            _db.engine.execute(DropTable(table))

        _db.engine.execute("DROP TYPE IF EXISTS attributetypeenum")
        _db.engine.execute("DROP TYPE IF EXISTS eventtypeenum")
        _db.engine.execute("DROP TYPE IF EXISTS eventformtypeenum")

        upgrade(path.join(_app.root_path, "migrations"))
    yield _app


@pytest.fixture(scope="session")
def db():
    return _db


@pytest.fixture
def test_client(app):
    return app.test_client()


@pytest.fixture
def account():
    account = AccountFactory(is_active=True)
    AccountSiteFactory(account_id=account.id)
    return account


@pytest.fixture
def roles():
    main_role = RoleFactory(name=UserRoleType.MAIN.value)
    admin_role = RoleFactory(name=UserRoleType.ADMIN.value)
    owner_role = RoleFactory(name=UserRoleType.OWNER.value)
    return (main_role, admin_role, owner_role)


@pytest.fixture
def pageview_event():
    event = EventFactory(
        account_site_id="random_site_id", event_type="pageview", event_timestamp=datetime.now()
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

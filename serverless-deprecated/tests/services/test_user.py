import pytest
from graphene.test import Client
from magic_pixel.graphql.schema import schema
from tests.factories import AccountFactory
from magic_pixel.services.user import create_new_user


def test_create_new_user(roles):
    account = AccountFactory()
    user = create_new_user(
        first_name="Test",
        last_name="Tester",
        email="test-tester@testing.com",
        account_id=str(account.id),
    )
    assert user


client = Client(schema)


def test_whoami(app, logged_in_admin):
    with app.test_request_context():
        executed = client.execute(
            """
                {
                    whoami {
                        id,
                        email,
                        account {
                            id,
                            name
                        },
                        roles {
                            id,
                            name
                        }
                    }
                }
        """
        )

    roles = executed["data"]["whoami"]["roles"]
    assert len(roles) == 2
    assert roles[0].get("name") == "MAIN"
    assert roles[1].get("name") == "ADMIN"

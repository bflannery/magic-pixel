import pytest

from magic_pixel.services.user import create_new_user
from tests.factories.account_factory import AccountFactory


def test_create_new_user(roles):
    account = AccountFactory()
    user = create_new_user(
        first_name="Test",
        last_name="Tester",
        email="test-tester@testing.com",
        account_id=str(account.id),
    )
    assert user

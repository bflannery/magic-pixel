import pytest

from server.services.account import create_new_account, verify_account_status


def test_create_new_account():
    account = create_new_account("test account")
    assert account


def test_verify_account_status(account):
    account_status = verify_account_status(account.mp_id)
    assert account_status == "active"

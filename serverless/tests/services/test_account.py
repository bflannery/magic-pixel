import pytest

from magic_pixel.services.account import create_new_account


def test_create_new_account():
    account = create_new_account("test account")
    assert account

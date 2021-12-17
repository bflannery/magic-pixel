from typing import Dict

from magic_pixel.db import db
from magic_pixel.models import Account


def create_new_account(name: str) -> Dict:
    account = Account(name=name, is_active=True).save()
    db.session.commit()
    return account


def verify_account_status(account) -> str:
    # TODO: account.is_active is temporary.
    #  We will want to check account plan status instead once stripe is setup.
    return "active" if account.is_active else "inactive"

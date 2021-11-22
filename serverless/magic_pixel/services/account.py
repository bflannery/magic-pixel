from magic_pixel import logger
from magic_pixel.db import db
from magic_pixel.models import Account


def create_new_account(name):
    account = Account(name=name, is_active=True).save()
    db.session.commit()
    return account


def verify_account_status(account_mp_id):
    account = Account.get_by_mp_id(account_mp_id)
    if not account:
        raise Exception(f"No account exists with hid: {account_mp_id}.")
    logger.log_info(f"Authentication Account: {account}")

    # TODO: account.is_active is temporary.
    #  We will want to check account plan status instead once stripe is setup.
    return "active" if account.is_active else "inactive"

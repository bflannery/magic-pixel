from typing import Dict

from magic_pixel.db import db
from magic_pixel.models import Account, AccountSite


def create_new_account(name: str) -> Dict:
    account = Account(name=name, is_active=True).save()
    db.session.commit()
    return account


def verify_account_status(account) -> str:
    # TODO: account.is_active is temporary.
    #  We will want to check account plan status instead once stripe is setup.
    return "active" if account.is_active else "inactive"


def get_valid_account(account_mp_id):
    account = Account.get_by_mp_id(account_mp_id)
    if not account:
        raise Exception(f"No account exists with account id: {account_mp_id}.")
    return account


def get_valid_account_site(account_site_mp_id):
    account_site = AccountSite.get_by_mp_id(account_site_mp_id)
    if not account_site:
        raise Exception(f"No account site exists with id: {account_site_mp_id}.")
    return account_site


def validate_event_params_and_get_account(parsed_event_body):
    account_mp_id = parsed_event_body.get("accountId")
    account_site_mp_id = parsed_event_body.get("accountSiteId")

    if not account_mp_id:
        raise Exception("Event has no account id.")

    if not account_site_mp_id:
        raise Exception("Event has no site id.")

    account = get_valid_account(account_mp_id)
    account_site = get_valid_account_site(account_site_mp_id)
    if account and account_site:
        return account
    else:
        return None

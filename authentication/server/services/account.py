from typing import Dict

from server.db import db
from server.models import Account, AccountSite


def create_new_account(name: str) -> Dict:
    account = Account(name=name, is_active=True).save()
    db.session.commit()
    return account


def get_valid_account_site(account_site_mp_id):
    account_site = AccountSite.get_by_mp_id(account_site_mp_id)
    if not account_site:
        raise Exception(f"No account site exists with id: {account_site_mp_id}.")
    return account_site


def verify_account_status(parsed_event_body) -> str:
    account_site_mp_id = parsed_event_body.get("accountSiteId")
    if not account_site_mp_id:
        raise Exception("Event has no site id.")
    account_site = get_valid_account_site(account_site_mp_id)
    # TODO: account.is_active is temporary.
    #  We will want to check account plan status instead once stripe is setup.
    return "active" if account_site.account.is_active else "inactive"

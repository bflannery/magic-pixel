from magic_pixel.db import db
from magic_pixel.models import Account


def create_new_account(name):
    account = Account(name=name, is_active=True).save()
    db.session.commit()
    return account


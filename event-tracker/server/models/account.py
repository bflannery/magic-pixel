from sqlalchemy import sql
from server.db import db
from .base import Model, WithHardDelete


class Account(Model, WithHardDelete):
    __tablename__ = "account"

    name = db.Column(db.Text, nullable=False, index=True, unique=True)
    industry = db.Column(db.Text)
    is_active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=sql.expression.false()
    )


class AccountSite(Model, WithHardDelete):
    __tablename__ = "account_site"
    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship(
        "Account", foreign_keys=[account_id], backref="account_sites"
    )
    name = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=False)

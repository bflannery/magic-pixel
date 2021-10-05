from flask_login import UserMixin
from sqlalchemy import sql
from magic_pixel.constants import AccountProductName
from magic_pixel.db import db
from magic_pixel.utility import random_hash
from .base import Base, MpIdMixin

AccountProductNameDBType = db.Enum(AccountProductName)


class Account(MpIdMixin, Base):
    __tablename__ = "account"

    name = db.Column(db.Text, nullable=False, index=True, unique=True)
    is_active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=sql.expression.false()
    )


class User(MpIdMixin, UserMixin, Base):
    __tablename__ = "user"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="users")
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=False, index=True, unique=True)
    session = db.Column(db.Text, default=lambda: random_hash(), index=True, unique=True)
    last_login_at = db.Column(db.DateTime, nullable=True)


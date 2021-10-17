from flask_login import UserMixin
from sqlalchemy import sql
from magic_pixel.db import db
from magic_pixel.utility import random_hash
from .base import Model, MpIdMixin
from magic_pixel.constants import UserRoleType


class Account(Model):
    __tablename__ = "account"

    name = db.Column(db.Text, nullable=False, index=True, unique=True)
    is_active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=sql.expression.false()
    )


class User(UserMixin, Model):
    __tablename__ = "user"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="users")
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=False, index=True, unique=True)
    session = db.Column(db.Text, default=lambda: random_hash(), index=True, unique=True)
    last_login_at = db.Column(db.DateTime, nullable=True)
    roles = db.relationship(
        "Role",
        secondary="user_roles",
        backref=db.backref("users", lazy="dynamic"),
    )

    @property
    def is_admin(self):
        return self.has_role(UserRoleType.ADMIN)

    @property
    def is_owner(self):
        return self.has_role(UserRoleType.OWNER)


class Role(MpIdMixin, db.Model):
    __tablename__ = "role"
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    role_id = db.Column(db.Integer(), db.ForeignKey("role.id"))

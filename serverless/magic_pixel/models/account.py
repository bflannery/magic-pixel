from flask_login import UserMixin
from sqlalchemy import sql
from magic_pixel.db import db
from sqlalchemy.dialects.postgresql import insert
from .base import Model, WithSoftDelete, WithHardDelete
from magic_pixel.constants import UserRoleType


class Account(Model, WithHardDelete):
    __tablename__ = "account"

    name = db.Column(db.Text, nullable=False, index=True, unique=True)
    industry = db.Column(db.Text)
    is_active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=sql.expression.false()
    )

    def user_has_access(self, user):
        if user.is_authenticated and user.is_admin:
            return True
        return self.id == getattr(user, "account_id", None)


class User(Model, UserMixin, WithSoftDelete):
    __tablename__ = "user"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="users")
    auth0_id = db.Column(db.Text, nullable=True)
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=False, index=True, unique=True)
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

    def has_role(self, role):
        return role.value in map(lambda x: x.name, self.roles)

    def save_conflict_ignore(self):
        auth0_id = self.auth0_id
        stmt = (
            insert(self.__class__)
            .values(
                email=self.email,
                first_name=self.first_name,
                last_name=self.last_name,
                auth0_id=auth0_id,
            )
            .returning(self.__class__.id)
            .on_conflict_do_nothing(index_elements=["auth0_id"])
        )
        db.session.execute(stmt)

        return User.query.filter(User.auth0_id == auth0_id).first()


class Role(Model, WithHardDelete):
    __tablename__ = "role"
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class UserRoles(Model, WithHardDelete):
    __tablename__ = "user_roles"
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    role_id = db.Column(db.Integer(), db.ForeignKey("role.id"))

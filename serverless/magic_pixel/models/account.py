from sqlalchemy import sql
from magic_pixel.constants import AccountProductName
from magic_pixel.db import db
from .base import Base, MpIdMixin

AccountProductNameDBType = db.Enum(AccountProductName)


class Account(MpIdMixin, Base):
    __tablename__ = "account"

    name = db.Column(db.Text, nullable=False, index=True, unique=True)
    is_active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=sql.expression.false()
    )

from flask_login import UserMixin

from sqlalchemy.dialects.postgresql.json import JSONB
from magic_pixel.db import db
from .base import Model, WithSoftDelete, WithHardDelete


class Person(Model, UserMixin, WithSoftDelete):
    __tablename__ = "person"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="persons")
    distinct_id = db.Column(db.Text, nullable=False, index=True)
    email = db.Column(db.Text, nullable=True, index=True)
    attributes = db.Column(JSONB, default={}, nullable=True)


class Alias(Model, WithHardDelete):
    __tablename__ = "alias"

    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id], backref="aliases")
    original_distinct_id = db.Column(db.Text, nullable=False)

from flask_login import UserMixin

from magic_pixel.db import db
from .base import Model, WithSoftDelete, WithHardDelete


class Person(Model, UserMixin, WithSoftDelete):
    __tablename__ = "person"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="persons")
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=True)


class Fingerprint(Model, WithHardDelete):
    __tablename__ = "fingerprint"

    value = db.Column(db.Text, nullable=False)

    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id], backref="fingerprints")




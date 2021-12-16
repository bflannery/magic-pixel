from flask_login import UserMixin

from magic_pixel.db import db
from magic_pixel.constants import AttributeTypeEnum
from .base import Model, WithSoftDelete, WithHardDelete


class Person(Model, UserMixin, WithSoftDelete):
    __tablename__ = "person"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="persons")


class Attribute(Model, WithHardDelete):
    __tablename__ = "attribute"

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship(
        "Account", foreign_keys=[account_id], backref="attributes"
    )
    event_form_id = db.Column(db.BigInteger, db.ForeignKey("event_form.id"), index=True)
    event_form = db.relationship(
        "EventForm", foreign_keys=[event_form_id], backref="event_forms"
    )
    type = db.Column(db.Enum(AttributeTypeEnum), nullable=False)
    name = db.Column(db.Text, nullable=False)


class PersonAttribute(Model, WithHardDelete):
    __tablename__ = "person_attribute"

    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship(
        "Person", foreign_keys=[person_id], backref="person_attributes"
    )

    attribute_id = db.Column(db.BigInteger, db.ForeignKey("attribute.id"), index=True)
    attribute = db.relationship("Attribute", foreign_keys=[attribute_id])

    value = db.Column(db.Text, nullable=True)


class Fingerprint(Model, WithHardDelete):
    __tablename__ = "fingerprint"

    value = db.Column(db.Text, nullable=False)

    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id], backref="fingerprints")

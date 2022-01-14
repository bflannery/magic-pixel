from flask_login import UserMixin

from sqlalchemy.dialects.postgresql.json import JSONB
from magic_pixel.db import db
from .base import Model


class Visitor(Model):
    __tablename__ = "visitor"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="visitor"
    )
    user_id = db.Column(db.Text, nullable=False)
    language = db.Column(db.Text, nullable=True)
    tz_offset = db.Column(db.Text, nullable=True)
    browser_name = db.Column(db.Text, nullable=True)
    platform = db.Column(db.Text, nullable=True)
    plugins = db.JSON(db.Text)
    ua = db.Column(db.Text, nullable=True)
    version = db.Column(db.Integer, nullable=True)
    screen_cd = db.Column(db.Text, nullable=True)
    screen_height = db.Column(db.Text, nullable=True)
    screen_width = db.Column(db.Text, nullable=True)


class Person(Model, UserMixin):
    __tablename__ = "person"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="visitor_persons"
    )
    user_id = db.Column(db.Text, nullable=True, index=True)
    email = db.Column(db.Text, nullable=True, index=True)
    username = db.Column(db.Text, nullable=True, index=True)
    first_name = db.Column(db.Text, nullable=True, index=True)
    last_name = db.Column(db.Text, nullable=True, index=True)
    attributes = db.Column(JSONB, default={}, nullable=True)


class Alias(Model):
    __tablename__ = "alias"

    named_alias = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Text, nullable=False)


class VisitorPerson(Model):
    __tablename__ = "visitor_person"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship("AccountSite", foreign_keys=[account_site_id])
    visitor_id = db.Column(db.BigInteger, db.ForeignKey("visitor.id"), index=True)
    visitor = db.relationship("Visitor", foreign_keys=[visitor_id])
    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id])


class PersonAlias(Model):
    __tablename__ = "person_alias"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship("AccountSite", foreign_keys=[account_site_id])
    alias_id = db.Column(db.BigInteger, db.ForeignKey("alias.id"), index=True)
    alias = db.relationship("Alias", foreign_keys=[alias_id])
    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id])

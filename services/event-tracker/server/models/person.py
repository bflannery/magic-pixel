from server.db import db
from .base import Model


class Person(Model):
    __tablename__ = "person"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="persons"
    )
    distinct_person_id = db.Column(db.Text, nullable=False, index=True)
    email = db.Column(db.Text, nullable=True, index=True)
    username = db.Column(db.Text, nullable=True)
    fullname = db.Column(db.Text, nullable=True)

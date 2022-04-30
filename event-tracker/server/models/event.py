from server.models.base import Model
from server.db import db


class Event(Model):
    __tablename__ = "event"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="events"
    )
    visitor_uuid = db.Column(db.Text, nullable=False)
    distinct_person_id = db.Column(db.Text, nullable=True)
    session_id = db.Column(db.Text, nullable=False)
    fingerprint = db.Column(db.Text, nullable=False, index=True)
    type = db.Column(db.Text, nullable=False)

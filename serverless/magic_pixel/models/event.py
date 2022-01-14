from magic_pixel.models.base import Model
from sqlalchemy.dialects.postgresql.json import JSONB
from magic_pixel.db import db


class Event(Model):
    __tablename__ = "event"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="events"
    )
    user_id = db.Column(db.Text, nullable=False)
    session_id = db.Column(db.Text, nullable=False)
    fingerprint = db.Column(db.Text, nullable=False, index=True)
    type = db.Column(db.Text, nullable=False)
    properties = db.Column(JSONB, default={}, nullable=True)

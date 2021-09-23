from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class Event(WithSoftDelete, Model):
    __tablename__ = "event"

    site_id = db.Column(db.BigInteger, nullable=False, index=True)
    event_type = db.Column(db.Text, nullable=False, index=True)
    fingerprint = db.Column(db.Text, nullable=True)
    q_id = db.Column(db.Text, nullable=True)
    session_id = db.Column(db.Text, nullable=True)
    visitor_id = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Text, nullable=True)
    user_profile = db.Column(db.Text, nullable=True)
    event_timestamp = db.Column(db.DateTime, nullable=True)

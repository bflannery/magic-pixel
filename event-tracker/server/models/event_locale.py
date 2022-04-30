from server.models.base import Model
from server.db import db


class EventLocale(Model):
    __tablename__ = "event_locale"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=db.backref("event_locale", uselist=False)
    )
    language = db.Column(db.Text, nullable=True)
    tz_offset = db.Column(db.Text, nullable=True)

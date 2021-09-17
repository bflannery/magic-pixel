from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class EventLocale(WithSoftDelete, Model):
    __tablename__ = "event_locale"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
    )

    site_id = db.Column(db.BigInteger, nullable=False, index=True)
    language = db.Column(db.Text, nullable=True)
    tz_offset = db.Column(db.Text, nullable=True)

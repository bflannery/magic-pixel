from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class EventSource(WithSoftDelete, Model):
    __tablename__ = "event_source"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
    )
    url = db.Column(db.Text, nullable=False)
    parameters = db.JSON(db.Text, nullable=True)

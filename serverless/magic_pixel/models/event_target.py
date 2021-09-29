from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db
from sqlalchemy.orm import backref


class EventTarget(WithSoftDelete, Model):
    __tablename__ = "event_target"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=backref("event_target", uselist=False)
    )
    url = db.Column(db.Text, nullable=True)
    selector = db.Column(db.Text, nullable=True)
    parameters = db.JSON(db.Text)

from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class EventTarget(WithSoftDelete, Model):
    __tablename__ = "event_target"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
    )

    site_id = db.Column(db.BigInteger, nullable=False, index=True)
    selector = db.Column(db.Text, nullable=True)
    url = db.Column(db.Text, nullable=False)
    parameters = db.JSON(db.Text, nullable=True)

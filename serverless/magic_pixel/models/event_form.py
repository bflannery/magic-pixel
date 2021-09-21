from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class EventForm(WithSoftDelete, Model):
    __tablename__ = "event_form"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
    )
    form_id = db.Column(db.Text, nullable=False)
    form_fields = db.JSON(db.Text, nullable=False)

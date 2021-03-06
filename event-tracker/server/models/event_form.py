from server.models.base import Model
from server.db import db
from sqlalchemy.dialects.postgresql.json import JSONB


class EventForm(Model):
    __tablename__ = "event_form"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=db.backref("event_form", uselist=False),
    )
    form_id = db.Column(db.Text, nullable=False)
    form_fields = db.Column(JSONB, default={}, nullable=False)


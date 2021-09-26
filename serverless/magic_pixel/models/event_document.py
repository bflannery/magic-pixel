from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db
from sqlalchemy.orm import backref


class EventDocument(WithSoftDelete, Model):
    __tablename__ = "event_document"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=backref("event_document", uselist=False)
    )
    title = db.Column(db.Text, nullable=True)
    referrer_url = db.Column(db.Text, nullable=True)
    document_url = db.Column(db.Text, nullable=False)
    document_parameters = db.JSON(db.Text)
    referral_parameters = db.JSON(db.Text)

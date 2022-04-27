from server.models.base import Model
from server.db import db


class EventDocument(Model):
    __tablename__ = "event_document"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=db.backref("event_document", uselist=False)
    )
    title = db.Column(db.Text, nullable=True)
    referrer_url = db.Column(db.Text, nullable=True)
    document_url = db.Column(db.Text, nullable=False)
    document_parameters = db.JSON(db.Text)
    referral_parameters = db.JSON(db.Text)

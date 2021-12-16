from magic_pixel.constants import EventTypeEnum
from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db


class Event(WithSoftDelete, Model):
    __tablename__ = "event"

    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True)
    person = db.relationship("Person", foreign_keys=[person_id], backref="events")

    account_id = db.Column(db.BigInteger, db.ForeignKey("account.id"), index=True)
    account = db.relationship("Account", foreign_keys=[account_id], backref="events")

    site_id = db.Column(db.Text, nullable=False, index=True)
    type = db.Column(db.Enum(EventTypeEnum), nullable=False)
    session_id = db.Column(db.Text, nullable=True)


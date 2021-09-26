from magic_pixel.models.base import WithSoftDelete, Model
from magic_pixel.db import db
from sqlalchemy.orm import backref


class EventBrowser(WithSoftDelete, Model):
    __tablename__ = "event_browser"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=backref("event_browser", uselist=False)
    )

    language = db.Column(db.Text, nullable=True)
    name = db.Column(db.Text, nullable=True)
    platform = db.Column(db.Text, nullable=True)
    plugins = db.JSON(db.Text)
    ua = db.Column(db.Text, nullable=True)
    version = db.Column(db.Integer, nullable=True)
    screen_cd = db.Column(db.Text, nullable=True)
    screen_height = db.Column(db.Text, nullable=True)
    screen_width = db.Column(db.Text, nullable=True)

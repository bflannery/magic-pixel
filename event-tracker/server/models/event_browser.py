from server.models.base import Model
from server.db import db


class EventBrowser(Model):
    __tablename__ = "event_browser"

    event_id = db.Column(
        db.BigInteger, db.ForeignKey("event.id"), index=True, nullable=False
    )
    event = db.relationship(
        "Event",
        foreign_keys=[event_id],
        backref=db.backref("event_browser", uselist=False)
    )

    browser_name = db.Column(db.Text, nullable=True)
    platform = db.Column(db.Text, nullable=True)
    plugins = db.JSON(db.Text)
    ua = db.Column(db.Text, nullable=True)
    version = db.Column(db.Integer, nullable=True)
    screen_cd = db.Column(db.Text, nullable=True)
    screen_height = db.Column(db.Text, nullable=True)
    screen_width = db.Column(db.Text, nullable=True)

from magic_pixel.db import db
from .base import Model


class Visitor(Model):
    __tablename__ = "visitor"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship(
        "AccountSite", foreign_keys=[account_site_id], backref="visitor"
    )
    visitor_uuid = db.Column(db.Text, nullable=False, index=True)
    fingerprint = db.Column(db.Text, nullable=False, index=True)
    language = db.Column(db.Text, nullable=True)
    tz_offset = db.Column(db.Text, nullable=True)
    browser_name = db.Column(db.Text, nullable=True)
    platform = db.Column(db.Text, nullable=True)
    plugins = db.JSON(db.Text)
    ua = db.Column(db.Text, nullable=True)
    version = db.Column(db.Integer, nullable=True)
    screen_cd = db.Column(db.Text, nullable=True)
    screen_height = db.Column(db.Text, nullable=True)
    screen_width = db.Column(db.Text, nullable=True)

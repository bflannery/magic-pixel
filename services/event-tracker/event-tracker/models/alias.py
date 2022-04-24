from magic_pixel.db import db
from .base import Model


class Alias(Model):
    __tablename__ = "alias"

    distinct_person_id = db.Column(db.Text, nullable=False, index=True)
    visitor_uuid = db.Column(db.Text, nullable=False, index=True)

from flask_login import UserMixin

from magic_pixel.db import db
from .base import Model, WithSoftDelete


class Person(Model, UserMixin, WithSoftDelete):
    __tablename__ = "person"

    fingerprint = db.Column(db.Text, nullable=True)
    first_name = db.Column(db.Text, nullable=True)
    last_name = db.Column(db.Text, nullable=True)
    email = db.Column(db.Text, nullable=True)
    phone = db.Column(db.Text, nullable=True)

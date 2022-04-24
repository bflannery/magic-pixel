from magic_pixel.db import db
from .base import Model


class VisitorPerson(Model):
    __tablename__ = "visitor_person"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship("AccountSite", foreign_keys=[account_site_id])
    visitor_id = db.Column(db.BigInteger, db.ForeignKey("visitor.id"), index=True, nullable=False)
    visitor = db.relationship("Visitor", foreign_keys=[visitor_id])
    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True, nullable=False)
    person = db.relationship("Person", foreign_keys=[person_id])
    confidence = db.Column(db.DECIMAL(precision=5, scale=2), index=True, nullable=False)
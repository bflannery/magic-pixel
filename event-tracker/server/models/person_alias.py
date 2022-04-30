from server.db import db
from .base import Model


class PersonAlias(Model):
    __tablename__ = "person_alias"

    account_site_id = db.Column(
        db.BigInteger, db.ForeignKey("account_site.id"), index=True
    )
    account_site = db.relationship("AccountSite", foreign_keys=[account_site_id])
    alias_id = db.Column(db.BigInteger, db.ForeignKey("alias.id"), index=True, nullable=False)
    alias = db.relationship("Alias", foreign_keys=[alias_id])
    person_id = db.Column(db.BigInteger, db.ForeignKey("person.id"), index=True, nullable=False)
    person = db.relationship("Person", foreign_keys=[person_id])
    confidence = db.Column(db.DECIMAL(precision=5, scale=2), index=True, nullable=False)

from datetime import datetime
from sqlalchemy import text
from magic_pixel.db import db


class Base(db.Model):
    """ Base model for our model classes. comes with save() helper and debug info. """

    __abstract__ = True

    def save(self, session=None):
        if not session:
            session = db.session
        session.add(self)

        return self


class Model(Base):
    """ Model class for all our models. """

    __abstract__ = True

    id = db.Column(db.BigInteger, primary_key=True)
    created_at = db.Column(
        db.DateTime, server_default=text("(now() at time zone 'utc')"), nullable=False
    )
    updated_at = db.Column(
        db.DateTime, server_default=text("(now() at time zone 'utc')")
    )

    def __repr__(self):
        id = self.id if self.id else None
        return "<{} {}>".format(self.__class__.__name__, id)

    def save(self, session=None):
        self.updated_at = datetime.utcnow()

        if hasattr(self, "audit_save"):
            self.audit_save()

        return super().save(session=session)


class WithHardDelete:
    """ Add hard delete to a model """

    def delete(self):
        db.session.delete(self)
        return self


class WithSoftDelete:
    """ Add soft delete to a model """

    deleted_at = db.Column(db.DateTime)

    def delete(self, force=False):
        if not force:
            self.deleted_at = datetime.utcnow()

            if hasattr(self, "audit_delete"):
                self.audit_delete()
        else:
            db.session.delete(self)

        return self

    def revive(self):
        self.deleted_at = None
        if hasattr(self, "audit_revive"):
            self.audit_revive()

        return self

import base64
from datetime import datetime
from typing import Optional

from sqlalchemy import text
from magic_pixel.db import db


class MpIdMixin:
    """
    Mixin to add calculated mp_id (a global id) to a sqlalchemy object.
    Requires a unique prefix for object, this defaults to the
    sqlalchemy object's __tablename__. it can be overwritten
    with __mp_id_prefix__ attribute
    """

    __tablename__ = None
    __mp_id_prefix__ = None
    _mp_id = None  # internal to cache id, assumes sqlalchemy object id never changes

    @classmethod
    def mp_id_prefix(cls) -> str:
        """ Calculate mp_id_prefix, should never change for a given class """
        prefix = cls.__mp_id_prefix__ if cls.__mp_id_prefix__ else cls.__tablename__
        if not prefix:
            raise NotImplementedError(
                "__mp_id_prefix__ or __tablename__ must be defined for mp_id"
            )
        return prefix

    @property
    def mp_id(self) -> Optional[str]:
        """ Get mp_id for db object. Note: if object not flushed to db this will return none until a db id is set """
        if self._mp_id:
            return self._mp_id
        return self._stash_mp_id()

    @classmethod
    def db_id_from_mp_id(cls, mp_id: str) -> int:
        """ Get db pk id from mp_id """
        if len(mp_id) % 4 != 0 and mp_id[-1] != "=":
            # read padding back to base64 string
            mp_id = mp_id + "=" * (-len(mp_id) % 4)
        (prefix, db_id) = base64.urlsafe_b64decode(mp_id).decode("ascii").split(":")
        if prefix != cls.mp_id_prefix() or not db_id or not db_id.isnumeric():
            raise Exception("Invalid mp_id for type")

        return int(db_id)

    @classmethod
    def get_by_mp_id(cls, mp_id: str):
        """ Get db object by mp_id """
        db_id = cls.db_id_from_mp_id(mp_id)
        return cls.query.get(db_id)

    def _stash_mp_id(self) -> Optional[str]:
        if self.id is None:
            return None
        self._mp_id = base64.urlsafe_b64encode(
            f"{self.mp_id_prefix()}:{self.id}".encode("ascii")
        ).decode("ascii")
        self._mp_id = self._mp_id.strip("=")
        return self._mp_id


class Base(db.Model):
    """ Base model for our model classes. comes with save() helper and debug info. """

    __abstract__ = True

    def save(self, session=None):
        if not session:
            session = db.session
        session.add(self)

        return self


class Model(MpIdMixin, Base):
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

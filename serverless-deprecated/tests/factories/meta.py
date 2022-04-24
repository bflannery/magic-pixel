from factory.alchemy import SQLAlchemyModelFactory
from magic_pixel.db import db


class BaseFactory(SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = "flush"

    @classmethod
    def _after_postgeneration(cls, instance, create, results=None):
        session = cls._meta.sqlalchemy_session
        session_persistence = cls._meta.sqlalchemy_session_persistence

        if session is None:
            raise RuntimeError("No session provided")
        if session_persistence == "flush":
            session.flush()
        elif session_persistence == "commit":
            session.commit()

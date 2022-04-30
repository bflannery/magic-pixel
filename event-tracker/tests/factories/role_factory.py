from factory import Sequence, Faker, post_generation

from server.models import Role
from .meta import BaseFactory


class RoleFactory(BaseFactory):
    class Meta:
        model = Role

    id = Sequence(lambda n: n)
    name = "MAIN"

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        current_model = model_class(*args, **kwargs)
        existing = model_class.query.filter_by(name=current_model.name).first()
        if existing:
            return existing
        return super(RoleFactory, cls)._create(model_class, *args, **kwargs)

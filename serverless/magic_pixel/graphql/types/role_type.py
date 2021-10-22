from graphene_sqlalchemy import SQLAlchemyObjectType
from magic_pixel.models import Role


class RoleType(SQLAlchemyObjectType):
    class Meta:
        model = Role
        # SECURITY: Prevent getting other users
        exclude_fields = ("users",)

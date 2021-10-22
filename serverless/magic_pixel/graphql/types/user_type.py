import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from magic_pixel.models import User
from .role_type import RoleType


class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User
        exclude_fields = ("session",)

    roles = graphene.List(graphene.NonNull(RoleType))

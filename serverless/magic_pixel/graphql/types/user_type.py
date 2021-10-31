import graphene
from .meta import BaseDBObject
from .role_type import RoleType


class UserType(BaseDBObject):
    created_at = graphene.DateTime(required=True)
    auth0_id = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String(required=True)
    last_login_at = graphene.DateTime()
    roles = graphene.List(graphene.NonNull(RoleType), required=True)
    account = graphene.NonNull("magic_pixel.graphql.types.AccountType")

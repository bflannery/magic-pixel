import graphene
from magic_pixel.constants import UserRoleType

RoleNames = graphene.Enum.from_enum(UserRoleType)


class KeywordFilterInput(graphene.InputObjectType):
    keywords = graphene.List(graphene.NonNull(graphene.String), required=True)


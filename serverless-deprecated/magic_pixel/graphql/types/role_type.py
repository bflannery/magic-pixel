import graphene

from magic_pixel.graphql.types.meta import BaseDBObject


class RoleType(BaseDBObject):
    name = graphene.String(required=True)

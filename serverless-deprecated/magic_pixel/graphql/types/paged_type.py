import graphene
from magic_pixel.models.paging import SortDirection as SortDirectionModel


class PagedType(graphene.ObjectType):
    cursor = graphene.String(required=False, default_value=None)
    total = graphene.Int(required=True)


SortDirection = graphene.Enum.from_enum(SortDirectionModel)

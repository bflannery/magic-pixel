import graphene
from .query import Query
from .mutations import Mutations

schema = graphene.Schema(query=Query, mutation=Mutations)

import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from flask_login import current_user

from magic_pixel.graphql.auth import owner_or_admin_only
from magic_pixel.models import (
    Account,
)
from .meta import BaseDBObject

from .paged_type import PagedType
from .user_type import UserType
from magic_pixel.graphql.input_types import KeywordFilterInput


class AccountSort(graphene.Enum):
    NAME = "name"


class AccountFilterInput(graphene.InputObjectType):
    search = KeywordFilterInput()


class AccountType(BaseDBObject):
    name = graphene.String()
    industry = graphene.String()
    is_active = graphene.Boolean()

    users = graphene.List(graphene.NonNull(UserType))

    @staticmethod
    @owner_or_admin_only
    def resolve_users(account_type, info):
        return [u for u in account_type.users if u.deleted_at is None]


class PagedAccountType(PagedType):
    results = graphene.List(graphene.NonNull(AccountType), required=True)


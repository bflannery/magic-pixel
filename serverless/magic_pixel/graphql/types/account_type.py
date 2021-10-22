import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from flask_login import current_user

from magic_pixel.graphql.auth import owner_or_admin_only
from magic_pixel.models import (
    Account,
)

from .paged_type import PagedType
from .user_type import UserType
from magic_pixel.graphql.input_types import KeywordFilterInput


class AccountSort(graphene.Enum):
    NAME = "name"


class AccountFilterInput(graphene.InputObjectType):
    search = KeywordFilterInput()


class AccountType(SQLAlchemyObjectType):
    class Meta:
        model = Account

    users = graphene.List(graphene.NonNull(UserType))

    @staticmethod
    @owner_or_admin_only
    def resolve_users(account_type, info):
        return [u for u in account_type.users if u.deleted_at is None]

    @classmethod
    def get_query(cls, info):
        query = super().get_query(info)
        if current_user.is_admin:
            return query
        return query.filter(Account.id == current_user.account_id)


class PagedAccountType(PagedType):
    results = graphene.List(graphene.NonNull(AccountType), required=True)


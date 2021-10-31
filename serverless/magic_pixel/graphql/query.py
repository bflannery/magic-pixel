from magic_pixel.graphql.types.paged_type import SortDirection
from magic_pixel.models.paging import AccountPaginator
from sqlalchemy import all_
from magic_pixel.graphql.types.account_type import (
    AccountFilterInput,
    AccountSort,
    PagedAccountType,
)
import graphene
from flask_login import current_user
from .auth import is_graphql_user
from .types import (
    AccountType,
    UserType,
)
from magic_pixel.models import (
    Account,
    User,
)


class Query(
    graphene.ObjectType,
):
    account = graphene.Field(AccountType, id=graphene.ID(required=True))
    accounts = graphene.Field(
        PagedAccountType,
        sort_by=AccountSort(required=False, default_value=AccountSort.NAME.value),
        sort_direction=SortDirection(
            required=False, default_value=SortDirection.ASC.value
        ),
        limit=graphene.Int(required=False, default_value=10),
        cursor=graphene.String(required=False, default_value=None),
        where=AccountFilterInput(),
    )
    whoami = graphene.Field(UserType)

    @staticmethod
    @is_graphql_user
    def resolve_account(root, info, id):
        account = Account.get_by_mp_id(id)
        if not account.user_has_access:
            return None

        return account

    @staticmethod
    @is_graphql_user
    def resolve_accounts(
        root,
        info,
        limit=10,
        sort_by=AccountSort(required=False, default_value=AccountSort.NAME.value),
        sort_direction=SortDirection(
            required=False, default_value=SortDirection.ASC.value
        ),
        cursor=None,
    ):
        query = Account.query
        if not current_user.is_admin:
            query = query.filter_by(id=current_user.account_id)
        else:
            query = query.order_by(Account.name)
        count = query.count()
        paginator = AccountPaginator()
        values, next_cursor = paginator.get_paged(
            query, sort_by, sort_direction, limit, cursor
        )
        return PagedAccountType(results=values, cursor=next_cursor, total=count)

    @is_graphql_user
    def resolve_whoami(self, info):
        me = User.query.filter_by(id=current_user.id).first()
        # me = UserType.get_query(info).get(current_user.id)
        return me

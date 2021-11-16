import graphene
from flask import current_app

from magic_pixel.graphql.auth import owner_or_admin_only

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
    embed_script = graphene.String()

    @staticmethod
    @owner_or_admin_only
    def resolve_users(account_node, info):
        return [u for u in account_node.users if u.deleted_at is None]

    @staticmethod
    @owner_or_admin_only
    def resolve_embed_script(account_node, info):
        mp_ip = account_node.mp_id
        tracker_script = current_app.config["S3_TRACKER_SCRIPT"]
        return f"""<script type="text/javascript" src="{tracker_script}?hid={mp_ip}"></script>"""


class PagedAccountType(PagedType):
    results = graphene.List(graphene.NonNull(AccountType), required=True)

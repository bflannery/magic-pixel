import graphene
from flask_login import current_user

from magic_pixel.db import db
from magic_pixel.services import user as user_service
from magic_pixel.models import User, Role, Account
from magic_pixel.graphql.auth import is_graphql_user, owner_or_admin_only
from magic_pixel.graphql.input_types import RoleNames
from magic_pixel.graphql.types import UserType
from magic_pixel.graphql.errors import ForbiddenError, NotFoundError, DuplicateKeyError


class CreateUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        account_id = graphene.ID(required=True)
        roles = graphene.List(graphene.NonNull(RoleNames))

    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    @is_graphql_user
    @owner_or_admin_only
    def mutate(self, info, email, account_id, roles=None):
        if roles is None:
            roles = []
        account = Account.get_by_lc_id(account_id)

        if not account:
            raise NotFoundError("Account not found")

        if not account.user_has_access(current_user):
            raise ForbiddenError("User does not have access to account.")

        user = User.query.filter_by(email=email).first()
        reactivating = False
        if user and user.deleted_at is None:
            raise DuplicateKeyError("User already exists")
        elif user and user.deleted_at:
            # reactivate user
            user.deleted_at = None
            reactivating = True
            # in case the user has changed accounts, move them to the current account
            user.account = account

        user_roles = []
        all_roles = Role.query.all()
        if roles:
            for role_name in roles:
                for role in all_roles:
                    if role_name == role.name and role not in user_roles:
                        user_roles.append(role)

        if reactivating:
            user_service.update_auth0_user_blocked_status(user.auth0_id, blocked=False)
            # append other roles the user might have had (Admin, Reviewer, etc)
            if user and user.roles:
                for role in user.roles:
                    if role not in user_roles:
                        user_roles.append(role)
            user.roles = user_roles
        else:
            created_by = (
                None
                if current_user.email.endswith("@magic_pixel.com")
                else current_user.email
            )
            auth0_user = user_service.create_auth0_user(email, account.name, created_by)
            if not auth0_user:
                raise Exception(f"Error: No auth0 user exists with email {email}.")
            user = User(
                email=email,
                auth0_id=auth0_user["user_id"],
                account=account,
                roles=user_roles,
            )
        user.save()
        db.session.commit()

        ok = True
        return CreateUser(ok=ok, user=user)

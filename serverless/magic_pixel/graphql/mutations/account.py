import graphene
from magic_pixel.graphql.auth import is_graphql_user
from magic_pixel.graphql.types import AccountType
from magic_pixel.graphql.errors import DuplicateKeyError, ForbiddenError
from flask_login import current_user
from magic_pixel.models import (
    Role,
    Account,
)
from magic_pixel.db import db


class SignupAccount(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        industry = graphene.String()
        title = graphene.String()

    ok = graphene.Boolean()
    account = graphene.Field(AccountType)

    @is_graphql_user
    def mutate(self, info, name):
        if current_user.account_id:
            raise ForbiddenError(
                "You can't create a new account if your user is "
                "already assigned to an account."
            )

        name = name.strip()

        existing_account = Account.query.filter_by(name=name).first()

        if existing_account:
            raise DuplicateKeyError("Account name already exists.")

        new_account = Account(name=name).save()
        owner_role = Role.query.filter(Role.name == "OWNER").one()
        main_role = Role.query.filter(Role.name == "MAIN").one()
        current_user.account = new_account
        current_user.roles = [main_role, owner_role]
        current_user.save()
        db.session.commit()

        return SignupAccount(ok=True, account=new_account)

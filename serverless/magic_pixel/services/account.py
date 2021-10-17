from magic_pixel.models import Account
from magic_pixel.models.account import User, Role


def create_new_account(name):
    account = Account(name=name, is_active=True).save()
    return account


def create_new_account_user(first_name, last_name, email, account_id, roles=None):
    account = Account.get_by_mp_id(account_id)
    if not account:
        raise Exception(f"No account found with account id {account_id}")

    user_roles = []
    all_roles = Role.query.all()
    if roles:
        for role_name in roles:
            for role in all_roles:
                if role_name == role.name and role not in user_roles:
                    user_roles.append(role)
    else:
        user_roles = ["MAIN"]

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        account_id=account_id,
        roles=user_roles,
    ).save()
    return user

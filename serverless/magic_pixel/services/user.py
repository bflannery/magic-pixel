from magic_pixel.db import db
from magic_pixel.models import Account, User, Role


def create_new_user(
    first_name=None, last_name=None, email=None, account_id=None, roles=None
):
    account = Account.get_by_mp_id(account_id)
    if not account:
        raise Exception(f"No account found with account id {account_id}.")

    user_roles = []
    all_roles = Role.query.all()
    if roles:
        for role_name in roles:
            for role in all_roles:
                if role_name == role.name and role not in user_roles:
                    user_roles.append(role)
    else:
        user_roles = list(filter(lambda r: r.name == 'MAIN', all_roles))

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        account=account,
        roles=user_roles,
    )
    user.save()
    db.session.commit()
    return user
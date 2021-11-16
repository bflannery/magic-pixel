from typing import Dict, Optional
from magic_pixel.db import db
from magic_pixel.lib.auth0 import Auth0Api
from magic_pixel.models import Account, User, Role
from datetime import datetime, timedelta


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
        user_roles = list(filter(lambda r: r.name == "MAIN", all_roles))

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


def create_basic_user_from_auth0(email, full_name, auth0_id):
    user = User.query.filter_by(email=email, auth0_id=None).first()
    if user and user.deleted_at is None:
        raise Exception("User already exists")
    else:
        split_name = full_name.split(" ", 1)
        first_name = split_name[0]
        last_name = split_name[1]
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            auth0_id=auth0_id,
        ).save_conflict_ignore()

        main_role = Role.query.filter(Role.name == "MAIN").first()
        user.roles = [main_role]
        user.save()
    return user


def create_auth0_user(email: str, account_name: str, created_by=None):
    auth0_api = Auth0Api()
    user_metadata = {
        "account_name": account_name,
        "created_by": created_by,
    }
    user = auth0_api.create_user(email, user_metadata)
    auth0_api.send_user_change_pw(user["email"])
    return user


def reinvite_user(user_email: str):
    auth0_api = Auth0Api()
    auth0_api.send_user_change_pw(user_email)


def update_auth0_user_blocked_status(user_id: str, blocked: bool) -> Optional[Dict]:
    return Auth0Api().update_user(user_id, {"blocked": blocked})


def get_auth0_user_from_token(token):
    jwt_payload = Auth0Api().validate_and_decode_user_jwt(token)
    auth0_user_id = jwt_payload["sub"]

    user = User.query.filter(User.auth0_id == auth0_user_id).first()
    if not user:
        auth0_user_info = Auth0Api().get_user_info(token)
        user = create_basic_user_from_auth0(
            auth0_user_info["email"], auth0_user_info["name"], auth0_user_id
        )
    elif (
        user
        and not user.last_login_at
        or user.last_login_at < datetime.utcnow() - timedelta(days=1)
    ):
        user.last_login_at = datetime.utcnow()
        user.save()
    db.session.commit()
    return user


def resend_user_verification_email(user_email):
    auth0_api = Auth0Api()
    users_by_email = auth0_api.get_users_by_email(user_email)

    if not users_by_email:
        raise Exception("No users exist with that email")

    user = users_by_email[0]
    user_id = user["user_id"]  # user_id of the user to send the verification email to.
    user_identity_id = user["identities"][0][
        "user_id"
    ]  # user_id of the identity to be verified.
    user_provider = user["identities"][0]["provider"]

    return auth0_api.send_user_verification_email(
        user_id, user_identity_id, user_provider
    )

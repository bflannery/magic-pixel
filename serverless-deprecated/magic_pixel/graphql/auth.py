from functools import wraps
from flask_login import current_user
from magic_pixel.graphql.errors import ForbiddenError, UnauthenticatedError


def admin_only(func):
    @wraps(func)
    def inner(*args, **kwargs):
        if not current_user.is_authenticated:
            raise UnauthenticatedError()
        if not current_user.is_admin:
            raise ForbiddenError()
        return func(*args, **kwargs)

    return inner


def owner_or_admin_only(func):
    @wraps(func)
    def inner(*args, **kwargs):
        if not current_user.is_authenticated:
            raise UnauthenticatedError()
        if not current_user.is_owner and not current_user.is_admin:
            raise ForbiddenError()
        return func(*args, **kwargs)

    return inner


def reviewer_only(func):
    @wraps(func)
    def inner(*args, **kwargs):
        if not current_user.is_authenticated:
            raise UnauthenticatedError()
        if not current_user.is_reviewer:
            raise ForbiddenError()
        return func(*args, **kwargs)

    return inner


def is_graphql_user(func):
    @wraps(func)
    def inner(*args, **kwargs):
        if not current_user.is_authenticated:
            raise UnauthenticatedError()
        return func(*args, **kwargs)

    return inner

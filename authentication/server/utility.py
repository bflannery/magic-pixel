import os
import re
from uuid import UUID

EMAIL_REGEX = "^[\\w'+_.-]+@[\\w.-]+$"
USERNAME_REGEX = "^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$"


def env():
    if is_offline():
        return "local"
    return os.environ.get("ENV")


def is_offline():
    return os.environ.get("IS_OFFLINE")


def is_local():
    env_var = env()
    return env_var == "local" or is_offline()


def is_valid_uuid(uuid_to_test, version=4):
    """
    Check if uuid_to_test is a valid UUID.

     Parameters
    ----------
    uuid_to_test : str
    version : {1, 2, 3, 4}

     Returns
    -------
    `True` if uuid_to_test is a valid UUID, otherwise `False`.

     Examples
    --------
    >>> is_valid_uuid('c9bf9e57-1685-4c89-bafb-ff5af830be8a')
    True
    False
    """

    try:
        uuid_obj = UUID(uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test

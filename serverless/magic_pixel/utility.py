import base64
import os
import string
from random import choice


def env():
    if is_offline():
        return "local"
    return os.environ.get("ENV")


def is_offline():
    return os.environ.get("IS_OFFLINE")


def is_local():
    env_var = env()
    return env_var == "local" or is_offline()


def parse_url(url_dict):
    return f"{url_dict['protocol']}//{url_dict['host']}{url_dict['pathname']}"


def random_hash():
    return "".join(
        [
            base64.urlsafe_b64encode(os.urandom(12)).decode("utf-8"),
            choice(string.ascii_letters),
        ]
    )

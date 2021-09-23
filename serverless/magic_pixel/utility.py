import os


def parse_url(url_dict):
    return f"{url_dict.protocol}//{url_dict.host}{url_dict.pathname}"


def env():
    if is_offline():
        return "local"
    return os.environ.get("ENV")


def is_offline():
    return os.environ.get("IS_OFFLINE")

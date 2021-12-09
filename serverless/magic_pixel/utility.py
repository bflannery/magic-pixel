import base64
import os
import re
import secrets
import string
import random

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


def parse_url(url_dict):
    return f"{url_dict['protocol']}//{url_dict['host']}{url_dict['pathname']}"


def random_hash():
    return "".join(
        [
            base64.urlsafe_b64encode(os.urandom(12)).decode("utf-8"),
            random.choice(string.ascii_letters),
        ]
    )


def is_valid_email(email):
    return re.search(EMAIL_REGEX, email)


def getattr_deep(object, name, default=None):
    if object is None:
        return default
    comps = name.split(".")
    current_value = object
    for comp in comps:
        current_value = getattr(current_value, comp, None)
        if current_value is None:
            return default
    return current_value


def b64encode_str(string, encoding="utf-8"):
    return str(base64.b64encode(string.encode(encoding)), encoding)


def b64decode_str(endcoded_str, encoding="utf-8"):
    return str(base64.b64decode(endcoded_str.encode(encoding)), encoding)


def generate_random_pw(pw_length=8):
    upper_case = string.ascii_uppercase
    random_upper_case = random.choice(upper_case)
    random_special_char = random.choice('!@#$%^&*')
    random_digit = random.choice(string.digits)
    available_chars = string.ascii_lowercase + upper_case + string.digits
    random_password = ''.join(secrets.choice(available_chars) for i in range(pw_length - 3))
    return random_upper_case + random_password + random_special_char + random_digit
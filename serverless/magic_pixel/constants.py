import enum


class AccountProductName(enum.Enum):
    BASE = "BASE"
    PRO = "PRO"


class UserRoleType(enum.Enum):
    MAIN = "MAIN"
    ADMIN = "ADMIN"
    OWNER = "OWNER"

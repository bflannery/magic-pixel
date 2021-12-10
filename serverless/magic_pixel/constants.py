import enum


class AccountProductName(enum.Enum):
    BASE = "BASE"
    PRO = "PRO"


class UserRoleType(enum.Enum):
    MAIN = "MAIN"
    ADMIN = "ADMIN"
    OWNER = "OWNER"


class TimeDimension(enum.Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"


class DateRangeFilterType(enum.Enum):
    RELATIVE = "RELATIVE"
    ABSOLUTE = "ABSOLUTE"


class DateRangeFilterUnits(enum.Enum):
    DAYS = "DAYS"
    WEEKS = "WEEKS"
    MONTHS = "MONTHS"
    YEARS = "YEARS"


class EventFormTypeEnum(enum.Enum):
    SIGN_UP = "sign_up"
    LOGIN = "login"

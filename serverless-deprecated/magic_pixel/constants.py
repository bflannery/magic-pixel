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


class AttributeTypeEnum(enum.Enum):
    EMAIL = "email"
    FIRST_NAME = "first_name"
    LAST_NAME = "last_name"
    OCCUPATION = "occupation"
    PHONE = "phone"
    ADDRESS = "address"
    ADDRESS_2 = "address_2"
    CITY = "city"
    STATE = "state"
    COUNTRY = "country"
    ZIP_CODE = "zip_code"
    TEXT = "text"

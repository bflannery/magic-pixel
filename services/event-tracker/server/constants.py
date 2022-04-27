import enum


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

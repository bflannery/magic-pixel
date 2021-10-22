import enum
from graphql import GraphQLError


CODE_KEY = "code"


class ErrorCodes(str, enum.Enum):
    UNAUTHENTICATED = "UNAUTHENTICATED"
    FORBIDDEN = "FORBIDDEN"
    NODE_NOT_FOUND = "NODE_NOT_FOUND"
    RESOURCE_LOCKED = "RESOURCE_LOCKED"
    DUPLICATE_KEY = "DUPLICATE_KEY"
    LIMIT_REACHED = "LIMIT_REACHED"
    BAD_REQUEST = "BAD_REQUEST"
    RESOURCE_EXHAUSTED = "RESOURCE_EXHAUSTED"
    INSUFFICIENT_PERMISSIONS_GRANTED = "INSUFFICIENT_PERMISSIONS_GRANTED"


class CodedError(GraphQLError):
    code = ""

    def __init__(self, message=""):
        super().__init__(message, extensions={CODE_KEY: self.code})


class UnauthenticatedError(CodedError):
    code = ErrorCodes.UNAUTHENTICATED


class ForbiddenError(CodedError):
    code = ErrorCodes.FORBIDDEN


class NotFoundError(CodedError):
    code = ErrorCodes.NODE_NOT_FOUND


class ResourceLockedError(CodedError):
    code = ErrorCodes.RESOURCE_LOCKED


class ResourceExhaustedError(CodedError):
    code = ErrorCodes.RESOURCE_EXHAUSTED


class DuplicateKeyError(CodedError):
    code = ErrorCodes.DUPLICATE_KEY


class LimitReachedError(CodedError):
    code = ErrorCodes.LIMIT_REACHED


class BadInputError(CodedError):
    code = ErrorCodes.BAD_REQUEST


class InsufficientPermissionsError(CodedError):
    code = ErrorCodes.INSUFFICIENT_PERMISSIONS_GRANTED
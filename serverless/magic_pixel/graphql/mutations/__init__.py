import graphene
from .account import SignupAccount


class Mutations(graphene.ObjectType):
    signup_account = SignupAccount.Field()


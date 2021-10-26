import graphene
from .account import SignupAccount
from .user import CreateUser, UpdateUser, DeleteUser, ResendUserInvite, ResendUserEmail


class Mutations(graphene.ObjectType):
    signup_account = SignupAccount.Field()
    create_user = CreateUser.Field()
    delete_user = DeleteUser.Field()
    update_user = UpdateUser.Field()
    resend_user_invite = ResendUserInvite.Field()
    resend_user_email = ResendUserEmail.Field()

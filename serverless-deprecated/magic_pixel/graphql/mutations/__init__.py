import graphene
from .account import CreateAccount
from .user import CreateUser, UpdateUser, DeleteUser, ResendUserInvite, ResendUserEmail


class Mutations(graphene.ObjectType):
    create_account = CreateAccount.Field()
    create_user = CreateUser.Field()
    delete_user = DeleteUser.Field()
    update_user = UpdateUser.Field()
    resend_user_invite = ResendUserInvite.Field()
    resend_user_email = ResendUserEmail.Field()

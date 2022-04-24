from factory import Faker, post_generation, SubFactory

from magic_pixel.models import User
from .meta import BaseFactory
from .account_factory import AccountFactory


class UserFactory(BaseFactory):
    class Meta:
        model = User

    email = Faker("email")
    account = SubFactory(AccountFactory)
    first_name = Faker("name")
    last_name = Faker("name")

    @post_generation
    def roles(self, create, extracted_roles, **kwargs):
        if create and extracted_roles:
            for role in extracted_roles:
                self.roles.append(role)

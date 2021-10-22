from factory import Faker
from magic_pixel.models import Account
from tests.factories.meta import BaseFactory


class AccountFactory(BaseFactory):
    class Meta:
        model = Account

    name = Faker("company")

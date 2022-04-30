from factory import Faker
from server.models import Account
from tests.factories.meta import BaseFactory


class AccountFactory(BaseFactory):
    class Meta:
        model = Account

    name = Faker("company")
    industry = Faker("name")

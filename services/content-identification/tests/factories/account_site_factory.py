from factory import Faker, SubFactory
from server.models import AccountSite
from tests.factories.meta import BaseFactory


class AccountSiteFactory(BaseFactory):
    class Meta:
        model = AccountSite

    name = Faker("company")
    url = Faker("url")

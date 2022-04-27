from factory import Faker, SubFactory

from server.constants import AttributeTypeEnum
from server.models import Person
from .event_form_factory import EventFormFactory
from .meta import BaseFactory
from .account_factory import AccountFactory


class PersonFactory(BaseFactory):
    class Meta:
        model = Person

    account = SubFactory(AccountFactory)

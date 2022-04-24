from factory import Faker, SubFactory

from magic_pixel.constants import AttributeTypeEnum
from magic_pixel.models import Person
from .event_form_factory import EventFormFactory
from .meta import BaseFactory
from .account_factory import AccountFactory


class PersonFactory(BaseFactory):
    class Meta:
        model = Person

    account = SubFactory(AccountFactory)

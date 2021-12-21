from factory import Faker, SubFactory

from magic_pixel.constants import AttributeTypeEnum
from magic_pixel.models import Person, PersonAttribute, Attribute
from .event_form_factory import EventFormFactory
from .meta import BaseFactory
from .account_factory import AccountFactory


class PersonFactory(BaseFactory):
    class Meta:
        model = Person

    account = SubFactory(AccountFactory)


class AttributeFactory(BaseFactory):
    class Meta:
        model = Attribute

    account = SubFactory(AccountFactory)
    event_form = SubFactory(EventFormFactory)
    type = AttributeTypeEnum.EMAIL
    name = "email"


class PersonAttributeFactory(BaseFactory):
    class Meta:
        model = PersonAttribute

    person = SubFactory(PersonFactory)
    attribute = SubFactory(AttributeFactory)
    value = Faker("email")

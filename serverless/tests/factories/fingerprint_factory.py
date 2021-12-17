from factory import Faker, SubFactory
from magic_pixel.models.person import Fingerprint
from .meta import BaseFactory
from .person_factory import PersonFactory


class FingerprintFactory(BaseFactory):
    class Meta:
        model = Fingerprint

    person = SubFactory(PersonFactory)
    value = '5f275ee3f92ca2b90d504fe8d8d7ba4f'


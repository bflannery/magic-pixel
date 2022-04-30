from faker import Faker, providers
from datetime import timezone

from server import utility
from server.constants import FilterEntity

Faker.seed("test_seed")
fake = Faker()


def _choose_from(items):
    return fake.random.choice(items) if items else None


class MagicPixelProvider(providers.BaseProvider):
    def platform_id(self):
        return f"{fake.random_int(10000000, 999999999)}"

    def random_token(self):
        return utility.random_base62(length=12)

    def name(self):
        return f"{fake.first_name()} {fake.last_name()}"

    def industry(self):
        return fake.pystr()

    def company(self):
        return fake.company()

    def image_url(self):
        return f"https://facebook.com/{utility.random_base62(length=12)}.jpg"

    def followers(self):
        return fake.random_int(0, 10000000)

    def impressions(self):
        return fake.random_int(0, 10000000)

    def comments_count(self):
        return fake.random_int(0, 10000)

    def engagement_rate(self):
        return fake.pyfloat(min_value=0, max_value=2)

    def like_count(self):
        return fake.random_int(0, 10000000)

    def media_type(self):
        return fake.random_element(elements=("IMAGE", "VIDEO", "CAROUSEL_ALBUM"))

    def media_post_type(self):
        return fake.random_element(elements=("FEED", "STORY"))

    def caption(self):
        return fake.paragraph()

    def code(self):
        return utility.random_base62()

    def filter_entity(self):
        return fake.random_element(list(FilterEntity))

    def recent_post_date_string(self):
        return (
            fake.date_time_between(start_date="-1w", end_date="now").isoformat()
            + "+0000"
        )

    def custom_field_type(self):
        return fake.random_element(elements=("TIKTOK", "TEXT"))

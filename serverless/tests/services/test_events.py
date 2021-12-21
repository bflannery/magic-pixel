import pytest

from magic_pixel.constants import EventTypeEnum, EventFormTypeEnum, AttributeTypeEnum
from magic_pixel.models import Event, EventForm
from magic_pixel.models.person import Person, Attribute, PersonAttribute, Fingerprint
from magic_pixel.services.event import (
    ingest_event_message,
)
from tests.factories import EventFactory, EventFormFactory
from tests.factories.fingerprint_factory import FingerprintFactory
from tests.factories.person_factory import (
    PersonFactory,
    AttributeFactory,
    PersonAttributeFactory,
)
from tests.mocks import MOCK_CLICK_EVENT, MOCK_PAGE_VIEW_EVENT, MOCK_FORM_SUBMIT_EVENT
from tests.mocks.form_submit import MOCK_FORM_FIELDS


def test_ingest_account_pageview_event_message_new_person(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_event["siteId"] = account_site.mp_id
    ingest_event_message(mock_event)
    events = Event.query.filter_by(account_id=account.id).all()
    assert len(events) == 2


def test_ingest_click_event_message_new_person(account):
    mock_event = MOCK_CLICK_EVENT
    mock_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_event["siteId"] = account_site.mp_id
    ingest_event_message(mock_event)
    events = Event.query.all()
    assert len(events) == 1


def test_ingest_form_event_message_new_person(account):
    mock_form_event = MOCK_FORM_SUBMIT_EVENT
    mock_form_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_form_event["siteId"] = account_site.mp_id
    mock_form_uuid = mock_form_event["form"]["formId"]
    event_fingerprint = mock_form_event["fingerprint"]
    ingest_event_message(mock_form_event)
    event_person = (
        Person.query.join(Fingerprint)
        .filter(Person.account_id == account.id, Fingerprint.value == event_fingerprint)
        .first()
    )
    event_form = EventForm.query.filter_by(form_id=mock_form_uuid).first()
    assert event_form
    form_attributes = Attribute.query.filter_by(event_form_id=event_form.id).all()
    assert form_attributes
    for form_attribute in form_attributes:
        person_attribute = PersonAttribute.query.filter_by(
            attribute_id=form_attribute.id
        ).first()
        assert person_attribute
        assert person_attribute.person_id == event_person.id


def test_ingest_form_event_message_with_email_for_existing_person(account):
    # In this scenario,
    # - Person A exists in our db with Fingerprint A.
    # - This person uses a new browser/device with new fingerprint, create new Person B with Fingerprint B
    # - Person B submits a form event with an Person A email
    # - Look up person by email
    # - Person A email matches event email

    # - If the email belongs to no one, should we create a new person?

    mock_form_event = MOCK_FORM_SUBMIT_EVENT

    person_a_email_value = mock_form_event["form"]["formFields"]["gx7zy-email"]

    person_a_fingerprint_1_value = "5f275ee3f92ca2b90d504fe8d8d7ba4f"
    person_b_fingerprint_1_value = "1x245ee3f92cbs2b90d504fe8d8d8bakl"

    person_a = PersonFactory(account=account, email=person_a_email_value)
    person_a_fingerprint_1 = FingerprintFactory(
        value=person_a_fingerprint_1_value, person=person_a
    )
    person_a_form_event = EventFactory(
        account=account,
        fingerprint=person_a_fingerprint_1,
        account_site=account.account_sites[0],
        type=EventTypeEnum.FORM_SUBMIT,
    )
    event_form = EventFormFactory(
        event=person_a_form_event,
        form_id="test-form",
        form_type=EventFormTypeEnum.SIGN_UP,
        form_fields=MOCK_FORM_FIELDS,
    )
    account_email_attribute = AttributeFactory(
        account=account, event_form=event_form, type=AttributeTypeEnum.EMAIL
    )
    person_a_email_attribute = PersonAttributeFactory(
        person=person_a, attribute=account_email_attribute, value=person_a_email_value
    )

    person_b = PersonFactory(account=account)
    person_b_fingerprint_1 = FingerprintFactory(
        value=person_b_fingerprint_1_value, person=person_b
    )
    person_b_event = EventFactory(
        account=account,
        fingerprint=person_b_fingerprint_1,
        account_site=account.account_sites[0],
        type=EventTypeEnum.PAGE_VIEW,
    )

    mock_form_event["accountId"] = account.mp_id
    account_site = account.account_sites[0]
    mock_form_event["accountSiteId"] = account_site.mp_id
    mock_form_event["fingerprint"] = person_b_fingerprint_1.value

    ingest_event_message(mock_form_event)

    mock_form_uuid = mock_form_event["form"]["formId"]
    event_form = EventForm.query.filter_by(form_id=mock_form_uuid).first()
    assert event_form

    fingerprints = Fingerprint.query.filter().all()
    form_attributes = Attribute.query.filter_by(event_form_id=event_form.id).all()
    assert form_attributes
    # for form_attribute in form_attributes:
    #     person_attribute = PersonAttribute.query.filter_by(
    #         attribute_id=form_attribute.id
    #     ).first()
    #     assert person_attribute
    #     assert person_attribute.person_id == event_person.id

import pytest
from magic_pixel.services.person import identify_person
from tests.factories.fingerprint_factory import FingerprintFactory
from tests.factories.person_factory import (
    PersonFactory,
)
from tests.mocks import MOCK_PAGE_VIEW_EVENT


def test_identify_new_person_by_fingerprint_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountId"] = account.mp_id
    event_person_fingerprint = mock_event["fingerprint"]
    person = identify_person(
        account.id, event_person_fingerprint, person_id=None
    )
    assert person
    assert person.account_id == account.id
    assert person.fingerprints
    person_fingerprints = [fp.value for fp in person.fingerprints]
    assert event_person_fingerprint in person_fingerprints


def test_identify_existing_person_by_fingerprint_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    event_fingerprint = mock_event["fingerprint"]
    person = PersonFactory(account=account)
    person_fingerprint = FingerprintFactory(value=event_fingerprint, person=person)
    mock_event["accountId"] = account.mp_id
    identified_person = identify_person(
        account.id, event_fingerprint, person_id=None
    )
    assert identified_person
    assert identified_person.account_id == account.id
    assert identified_person.id == person.id
    assert len(identified_person.fingerprints) == 1
    assert identified_person.fingerprints[0].value == person_fingerprint.value


def test_identify_existing_person_by_id_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    event_fingerprint = mock_event["fingerprint"]
    person = PersonFactory(account=account)
    person_fingerprint = FingerprintFactory(value=event_fingerprint, person=person)
    mock_event["accountId"] = account.mp_id
    mock_event["personId"] = person.mp_id
    identified_person = identify_person(
        account.id, event_fingerprint, person_id=person.mp_id
    )
    assert identified_person
    assert identified_person.account_id == account.id
    assert identified_person.id == person.id
    assert len(identified_person.fingerprints) == 1
    assert identified_person.fingerprints[0].value == person_fingerprint.value

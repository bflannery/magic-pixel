from magic_pixel.models.person import Person, Fingerprint
from magic_pixel.services.person import identify_event_person
from tests.mocks import MOCK_FORM_SUBMIT_EVENT, MOCK_PAGE_VIEW_EVENT


def test_identify_person_on_event(account):
    mock_event = MOCK_PAGE_VIEW_EVENT
    mock_event["accountHid"] = account.mp_id
    event_person_fingerprint = mock_event["fingerprint"]
    identify_event_person(account.id, mock_event)
    person = Person.query.filter_by(
        account_id=account.id, fingerprint=event_person_fingerprint
    ).first()
    assert person
    assert person.account_id == account.id


def test_identify_new_person_on_form_submit(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
    first_name = "Testy"
    last_name = "McTester"
    email = "testy_mctester@gmail.com"
    fingerprint = mock_event["fingerprint"]
    form_fields = (
        {
            "gzdy-first-name": first_name,
            "customer[lname]": last_name,
            "gx7zy-email": email,
            "anonymous": ["78721", "Sign up"],
        },
    )
    mock_event["form"]["form_fields "] = form_fields
    mock_event["accountHid"] = account.mp_id

    identify_event_person(account.id, mock_event)

    person = Person.query.filter_by(email=email).first()
    assert person
    assert person.first_name == first_name
    assert person.last_name == last_name
    assert person.email == email
    fingerprint = Fingerprint.query.filter_by(
        person_id=person.id, value=fingerprint
    ).first()
    assert person.fingerprints[0].value == fingerprint.value


def test_identify_form_by_form_id(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
    mock_event["form"]["formId"] = "create_"
    first_name = "Testy"
    last_name = "McTester"
    email = "testy_mctester@gmail.com"
    fingerprint = mock_event["fingerprint"]
    form_fields = (
        {
            "gzdy-first-name": first_name,
            "customer[lname]": last_name,
            "gx7zy-email": email,
            "anonymous": ["78721", "Sign up"],
        },
    )
    mock_event["form"]["form_fields "] = form_fields
    mock_event["accountHid"] = account.mp_id

    identify_event_person(account.id, mock_event)

    person = Person.query.filter_by(email=email).first()
    assert person
    assert person.first_name == first_name
    assert person.last_name == last_name
    assert person.email == email
    fingerprint = Fingerprint.query.filter_by(
        person_id=person.id, value=fingerprint
    ).first()
    assert person.fingerprints[0].value == fingerprint.value

from magic_pixel.models.person import Person
from magic_pixel.services.person import identify_person_on_form_submit, identify_event_person
from tests.mocks import MOCK_FORM_SUBMIT_EVENT, MOCK_PAGE_VIEW_EVENT


def test_identify_person_on_form_submit(account):
    mock_event = MOCK_FORM_SUBMIT_EVENT
    first_name = 'Testy'
    last_name = 'McTester'
    email = 'testy_mctester@gmail.com'
    form_fields = {
        "gzdy-first-name": first_name,
        "customer[lname]": last_name,
        "gx7zy-email": email,
        "anonymous": ['78721', 'Sign up'],
    },
    mock_event["form"]["form_fields "] = form_fields
    mock_event["accountHid"] = account.mp_id

    identify_event_person(account.id, mock_event)

    person = Person.query.filter_by(email=email).first()
    assert person
    assert person.first_name == first_name
    assert person.last_name == last_name
    assert person.email == email


# def test_create_new_account_person_on_event(account):
#     mock_event = MOCK_PAGE_VIEW_EVENT
#     mock_event["accountHid"] = account.mp_id
#     event_person_fingerprint = mock_event["fingerprint"]
#     ingest_event_message(mock_event)
#     person = Person.query.filter_by(
#         account_id=account.id, fingerprint=event_person_fingerprint
#     ).first()
#     assert len(person) == 1
#     assert person.account_id == account.id
#     assert len(person.events) == 1
#     account_person_event = person.events[0]
#     assert account_person_event.fingerprint == event_person_fingerprint

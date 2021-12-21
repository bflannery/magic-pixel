from magic_pixel.constants import EventTypeEnum

# {'fingerprint': '28b87e8fcc0f2092892bec9c342dea52', 'sessionId': '9202c1e3-d468-8f33-e3a6-cb83526aaf90', 'visitorId': '03d1f8ed-3866-1be0-20ac-7cabec2899e1', 'userId': None, 'userProfile': None, 'form': {'formId': 'create_customer', 'formFields': {'gzdy-fname': 'first name', 'customer[lname]': 'last name', 'email': 'test_test@gmail.com', 'anonymous': 'Sign up'}}, 'timestamp': '2021-12-21T10:41:17.885Z', 'event': 'form_submit', 'source': {'url': {'host': 'localhost:8080', 'hostname': 'localhost', 'pathname': '/signup.html', 'protocol': 'http:'}}, 'accountId': 'YWNjb3VudDox', 'accountSiteId': 'YWNjb3VudF9zaXRlOjE=', 'personId': 'cGVyc29uOjM'}

MOCK_FORM_FIELDS = {
    "gzdy-fname": "Testy",
    "customer[lname]": "McTester",
    "gx7zy-email": "testy_mctester@gmail.com",
    "anonymous": ["78721", "Sign up"],
}

MOCK_FORM_UUID = {
    "formId": "545a0ef6-4324-c37f-cf7b-9b97b9ebf865",
    "formFields": MOCK_FORM_FIELDS,
}

MOCK_FORM_SUBMIT_EVENT = {
    "accountId": None,
    "personId": None,
    "fingerprint": "5f275ee3f92ca2b90d504fe8d8d7ba4f",
    "sessionId": "35b93ee3-7456-820d-767e-d59e3a629f8d",
    "form": MOCK_FORM_UUID,
    "timestamp": "2021-12-02T01:41:27.171Z",
    "event": EventTypeEnum.FORM_SUBMIT.value,
    "siteId": "3aNgZ99g",
    "source": {
        "url": {
            "host": "localhost:8080",
            "hostname": "localhost",
            "pathname": "/signup.html",
            "protocol": "http:",
        }
    },
}

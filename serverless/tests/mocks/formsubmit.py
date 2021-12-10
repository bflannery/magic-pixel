
MOCK_FORM_UUID = {
    "formId": "545a0ef6-4324-c37f-cf7b-9b97b9ebf865",
    "formFields": {
        "gzdy-fname": "Testy",
        "customer[lname]": "McTester",
        "gx7zy-email": "testy_mctester@gmail.com",
        "anonymous": ['78721', 'Sign up'],
    },
}


MOCK_FORM_SUBMIT_EVENT = {
    "fingerprint": "5f275ee3f92ca2b90d504fe8d8d7ba4f",
    "sessionId": "35b93ee3-7456-820d-767e-d59e3a629f8d",
    "visitorId": "1d21f685-51ff-ebe9-e315-6c4f0a3175d7",
    "userId": "a1a5185f519554c6011ce9c14483965d",
    "userProfile": None,
    "form": MOCK_FORM_UUID,
    "timestamp": "2021-12-02T01:41:27.171Z",
    "event": "formsubmit",
    "source": {
        "url": {
            "host": "localhost:8080",
            "hostname": "localhost",
            "pathname": "/signup.html",
            "protocol": "http:",
        }
    },
}
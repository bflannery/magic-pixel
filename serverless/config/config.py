import os

# Flask
SECRET_KEY = os.environ.get("SECRET_KEY", default="__fake__")
ENV = os.environ.get("ENV", default="local")

# Postgres
POSTGRES_USER = os.environ.get("POSTGRES_USER", default="postgres")
POSTGRES_PW = os.environ.get("POSTGRES_USER", default="password")
POSTGRES_URL = os.environ.get("POSTGRES_USER", default="localhost")
POSTGRES_DB = os.environ.get("POSTGRES_USER", default="postgres")
DB_URL = "postgresql+psycopg2://{user}:{pw}@{url}/{db}".format(
    user=POSTGRES_USER, pw=POSTGRES_PW, url=POSTGRES_URL, db=POSTGRES_DB
)

# Sqlalchemy
SQLALCHEMY_DATABASE_URI = DB_URL
SQLALCHEMY_TRACK_MODIFICATIONS = False

# SQS
SQS_EVENT_QUEUE_NAME = os.environ.get("SQS_EVENT_QUEUE_NAME", default="__fake__")
SQS_IDENTITY_QUEUE_NAME = os.environ.get("SQS_IDENTITY_QUEUE_NAME", default="__fake__")
SQS_REGION = os.environ.get("SQS_REGION", default="__fake__")
SQS_ENDPOINT_URL = os.environ.get("SQS_ENDPOINT_URL", default="__fake__")

# Auth0
AUTH0_CUSTOM_DOMAIN = os.environ.get("AUTH0_CUSTOM_DOMAIN", default="__fake__")
AUTH0_MGMT_DOMAIN = os.environ.get("AUTH0_MGMT_DOMAIN", default="__fake__")
AUTH0_DB = os.environ.get("AUTH0_DB", default="__fake__")
AUTH0_API_URL = os.environ.get("AUTH0_API_URL", default="__fake__")
AUTH0_API_CLIENT_ID = os.environ.get("AUTH0_API_CLIENT_ID", default="__fake__")
AUTH0_APP_CLIENT_ID = os.environ.get("AUTH0_APP_CLIENT_ID", default="__fake__")
AUTH0_API_CLIENT_SECRET = os.environ.get("AUTH0_API_CLIENT_SECRET", default="__fake__")


{
    "body": '{"fingerprint":"9292b510b524fd5cbf3f7b8e1b964739","sessionId":"51061f58-d405-449a-2ffb-e83d0db5e3a4","visitorId":"cc9b9c95-ea89-7c8c-6d01-d27434fe6175","userId":null,"userProfile":null,"browser":{"ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36","name":"Chrome","version":96,"platform":"Mac","language":"en-US","plugins":[{"name":"Chrome PDF Plugin","description":"Portable Document Format","filename":"internal-pdf-viewer","mimeType":{"type":"application/x-google-chrome-pdf","description":"Portable Document Format","suffixes":"pdf"}},{"name":"Chrome PDF Viewer","filename":"mhjfbmdgcfjbbpaeojofohoefgiehjai","mimeType":{"type":"application/pdf","suffixes":"pdf"}},{"name":"Native Client","filename":"internal-nacl-plugin","mimeType":{"type":"application/x-nacl","description":"Native Client Executable"}}]},"document":{"title":"Shop Around","url":{"host":"localhost:8080","hostname":"localhost","pathname":"/","protocol":"http:"}},"screen":{"height":900,"width":1440,"colorDepth":30},"locale":{"language":"en-US","timezoneOffset":360,"timezone":"America/Chicago"},"url":{"host":"localhost:8080","hostname":"localhost","pathname":"/","protocol":"http:"},"timestamp":"2022-01-16T02:17:49.445Z","event":"page_view","source":{"url":{"host":"localhost:8080","hostname":"localhost","pathname":"/","protocol":"http:"}},"type":"page_view","accountSiteId":"YWNjb3VudF9zaXRlOjE=","visitorUUID":"ffc49d38-2fc6-5907-2091-909362336baf","distinctPersonId":null}',
    "headers": {
        "Host": "localhost:5000",
        "Connection": "keep-alive",
        "Content-Length": "1529",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        "DNT": "1",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "sec-ch-ua-platform": '"macOS"',
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Origin": "http://localhost:8080",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "http://localhost:8080/",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
    },
    "httpMethod": "POST",
    "isBase64Encoded": False,
    "multiValueHeaders": {
        "Host": ["localhost:5000"],
        "Connection": ["keep-alive"],
        "Content-Length": ["1529"],
        "Pragma": ["no-cache"],
        "Cache-Control": ["no-cache"],
        "sec-ch-ua": [
            '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"'
        ],
        "DNT": ["1"],
        "sec-ch-ua-mobile": ["?0"],
        "User-Agent": [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        ],
        "sec-ch-ua-platform": ['"macOS"'],
        "Content-Type": ["application/json"],
        "Accept": ["*/*"],
        "Origin": ["http://localhost:8080"],
        "Sec-Fetch-Site": ["same-site"],
        "Sec-Fetch-Mode": ["cors"],
        "Sec-Fetch-Dest": ["empty"],
        "Referer": ["http://localhost:8080/"],
        "Accept-Encoding": ["gzip, deflate, br"],
        "Accept-Language": ["en-US,en;q=0.9"],
    },
    "multiValueQueryStringParameters": None,
    "path": "/collection",
    "pathParameters": None,
    "queryStringParameters": None,
    "requestContext": {
        "accountId": "offlineContext_accountId",
        "apiId": "offlineContext_apiId",
        "authorizer": {"principalId": "offlineContext_authorizer_principalId"},
        "domainName": "offlineContext_domainName",
        "domainPrefix": "offlineContext_domainPrefix",
        "extendedRequestId": "ckygmp8r40003983ae69ig0cg",
        "httpMethod": "POST",
        "identity": {
            "accessKey": None,
            "accountId": "offlineContext_accountId",
            "apiKey": "offlineContext_apiKey",
            "apiKeyId": "offlineContext_apiKeyId",
            "caller": "offlineContext_caller",
            "cognitoAuthenticationProvider": "offlineContext_cognitoAuthenticationProvider",
            "cognitoAuthenticationType": "offlineContext_cognitoAuthenticationType",
            "cognitoIdentityId": "offlineContext_cognitoIdentityId",
            "cognitoIdentityPoolId": "offlineContext_cognitoIdentityPoolId",
            "principalOrgId": None,
            "sourceIp": "127.0.0.1",
            "user": "offlineContext_user",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
            "userArn": "offlineContext_userArn",
        },
        "path": "/collection",
        "protocol": "HTTP/1.1",
        "requestId": "ckygmp8r40004983aepc70iqs",
        "requestTime": "15/Jan/2022:20:17:49 -0600",
        "requestTimeEpoch": 1642299469454,
        "resourceId": "offlineContext_resourceId",
        "resourcePath": "/dev/collection",
        "stage": "dev",
    },
    "resource": "/collection",
}

import os

SECRET_KEY = os.environ.get("SECRET_KEY", default="__fake__")

POSTGRES_USER = os.environ.get("POSTGRES_USER", default="postgres")
POSTGRES_PW = os.environ.get("POSTGRES_USER", default="password")
POSTGRES_URL = os.environ.get("POSTGRES_USER", default="localhost")
POSTGRES_DB = os.environ.get("POSTGRES_USER", default="postgres")
DB_URL = "postgresql+psycopg2://{user}:{pw}@{url}/{db}".format(
    user=POSTGRES_USER, pw=POSTGRES_PW, url=POSTGRES_URL, db=POSTGRES_DB
)

ENV = os.environ.get("ENV", default="local")

SQS_REGION_NAME = os.environ.get("SQS_ENDPOINT_URL", default="elasticmq")
SQS_ENDPOINT_URL = os.environ.get("SQS_ENDPOINT_URL", default="http://localhost:9324")

SQLALCHEMY_DATABASE_URI = DB_URL
SQLALCHEMY_TRACK_MODIFICATIONS = False

EVENT_QUEUE_NAME = os.environ.get("EVENT_QUEUE_NAME", default="local-event-queue")
EVENT_BROWSER_QUEUE_NAME = os.environ.get(
    "EVENT_BROWSER_QUEUE_NAME", default="__fake__"
)
EVENT_DOCUMENT_QUEUE_NAME = os.environ.get(
    "EVENT_DOCUMENT_QUEUE_NAME", default="__fake__"
)
EVENT_FORM_QUEUE_NAME = os.environ.get("EVENT_FORM_QUEUE_NAME", default="__fake__")
EVENT_LOCALE_QUEUE_NAME = os.environ.get("EVENT_LOCALE_QUEUE_NAME", default="__fake__")
EVENT_SOURCE_QUEUE_NAME = os.environ.get("EVENT_SOURCE_QUEUE_NAME", default="__fake__")
EVENT_TARGET_QUEUE_NAME = os.environ.get("EVENT_TARGET_QUEUE_NAME", default="__fake__")
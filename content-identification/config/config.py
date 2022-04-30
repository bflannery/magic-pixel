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

# Service
API_DOMAIN = os.environ.get("API_DOMAIN", default="__fake__")

# Sqlalchemy
SQLALCHEMY_DATABASE_URI = DB_URL
SQLALCHEMY_TRACK_MODIFICATIONS = False

# SQS
SQS_REGION = os.environ.get("SQS_REGION", default="__fake__")
SQS_ENDPOINT_URL = os.environ.get("SQS_ENDPOINT_URL", default="__fake__")
SQS_CONTENT_IDENTIFICATION_QUEUE_NAME = os.environ.get(
    "SQS_CONTENT_IDENTIFICATION_QUEUE_NAME", default="__fake__"
)

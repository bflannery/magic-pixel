POSTGRES_USER = "postgres"
POSTGRES_PW = "password"
POSTGRES_URL = "localhost"
POSTGRES_DB = "postgres"
DB_URL = "postgresql+psycopg2://{user}:{pw}@{url}/{db}".format(
    user=POSTGRES_USER, pw=POSTGRES_PW, url=POSTGRES_URL, db=POSTGRES_DB
)
SQLALCHEMY_DATABASE_URI = DB_URL
S3_TRACKER_SCRIPT = "http://localhost:8081/mp-tracker.js"

SQS_REGION = "elasticmq"
SQS_ENDPOINT_URL = "http://localhost:9324"

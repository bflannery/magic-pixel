# Postgres
POSTGRES_USER = "postgres"
POSTGRES_PW = "password"
POSTGRES_URL = "localhost"
POSTGRES_DB = "postgres"
DB_URL = "postgresql+psycopg2://{user}:{pw}@{url}:5433/{db}".format(
    user=POSTGRES_USER, pw=POSTGRES_PW, url=POSTGRES_URL, db=POSTGRES_DB
)

# Sqlalchemy
SQLALCHEMY_DATABASE_URI = DB_URL

# SQS
SQS_REGION = "elasticmq"
SQS_ENDPOINT_URL = "http://localhost:9324"

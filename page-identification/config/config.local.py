# Postgres
POSTGRES_USER = "postgres"
POSTGRES_PW = "password"
POSTGRES_URL = "localhost"
POSTGRES_DB = "postgres"
DB_URL = "postgresql+psycopg2://{user}:{pw}@{url}/{db}".format(
    user=POSTGRES_USER, pw=POSTGRES_PW, url=POSTGRES_URL, db=POSTGRES_DB
)

# Service
API_DOMAIN = "http://localhost:5000/dev"

# Sqlalchemy
SQLALCHEMY_DATABASE_URI = DB_URL

# SQS
SQS_REGION = "elasticmq"
SQS_ENDPOINT_URL = "http://localhost:9324"

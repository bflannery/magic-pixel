from flask_migrate import Migrate
from aws_xray_sdk.ext.flask_sqlalchemy.query import XRayFlaskSqlAlchemy


db = XRayFlaskSqlAlchemy()
migrate = Migrate()

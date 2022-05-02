from aws_xray_sdk.ext.flask_sqlalchemy.query import XRayFlaskSqlAlchemy
from flask_migrate import Migrate

db = XRayFlaskSqlAlchemy()
migrate = Migrate()

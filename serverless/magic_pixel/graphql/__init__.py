from flask_cors import cross_origin
from flask_graphql import GraphQLView
from .schema import schema
from .loaders import create_loaders

graphql_view = cross_origin(
    origins=["http://localhost:300[0-9]", r"^https://.*\.(get)?loudcrowd\.com$"],
    supports_credentials=True,
)(
    GraphQLView.as_view(
        "graphql",
        schema=schema,
        graphiql=True,
        get_context=create_loaders,
        middleware=[], # TODO: Add Xray and Sentry Monitoring
    )
)

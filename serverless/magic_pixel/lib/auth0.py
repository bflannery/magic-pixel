import requests
from typing import Dict, Optional, List
from magic_pixel import logger
from werkzeug.exceptions import BadRequest, Unauthorized
from auth0.v3.authentication import GetToken, Users, Database
from auth0.v3.management import Auth0
from flask import current_app
from jose import jwt
from magic_pixel.utility import generate_random_pw


# Auth0-Python
# https://github.com/auth0/auth0-python


class Auth0Api:
    def __init__(self):
        self.custom_domain = current_app.config.get("AUTH0_CUSTOM_DOMAIN")
        self.mgmt_domain = current_app.config.get("AUTH0_MGMT_DOMAIN")
        self.auth_api_url = current_app.config.get("AUTH0_API_URL")
        self.client_id = current_app.config.get("AUTH0_API_CLIENT_ID")
        self.app_client_id = current_app.config.get("AUTH0_APP_CLIENT_ID")
        self.client_secret = current_app.config.get("AUTH0_API_CLIENT_SECRET")
        self.connection = current_app.config.get("AUTH0_DB")
        self.mgmt_domain_api = f"https://{self.mgmt_domain}/api/v2/"
        self.mgmt_api = None

    def get_mgmt_token(self) -> Optional[str]:
        get_token = GetToken(self.mgmt_domain)
        token = get_token.client_credentials(
            self.client_id, self.client_secret, self.mgmt_domain_api
        )
        return token["access_token"]

    def initialize_auth0_mgmt_api(self):
        try:
            mgmt_api_token = self.get_mgmt_token()
            self.mgmt_api = Auth0(self.mgmt_domain, mgmt_api_token)
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to initialize the auth0 mgmt api.")

    def get_rsa_key(self, token: str) -> Optional[Dict]:
        try:
            response = requests.get(f"https://{self.custom_domain}/.well-known/jwks.json")
            jwks = response.json()
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
            return rsa_key
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to verify rsa_key.")

    def validate_and_decode_user_jwt(self, token: str) -> Optional[Dict]:
        rsa_key = self.get_rsa_key(token)
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=self.auth_api_url,
                issuer="https://" + self.custom_domain + "/",
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise Unauthorized("Token is expired.")
        except jwt.JWTClaimsError:
            raise BadRequest("Incorrect claims, please check the audience and issuer.")
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to parse authentication token.")

    def get_user_info(self, token: str) -> Optional[Dict]:
        return Users(self.custom_domain).userinfo(token)

    def get_users_by_email(self, email: str) -> Optional[List[Dict]]:
        if not self.mgmt_api:
            self.initialize_auth0_mgmt_api()

        return self.mgmt_api.users_by_email.search_users_by_email(email)

    def create_user(self, email: str, user_metadata: Dict[str, str]):
        if not self.mgmt_api:
            self.initialize_auth0_mgmt_api()
        random_password = generate_random_pw()
        body = {
            "email": email,
            "connection": self.connection,
            "password": random_password,
            "verify_email": False,
            "user_metadata": user_metadata
        }
        try:
            user = self.mgmt_api.users.create(body)
            return user
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to create auth0 user.")

    def update_user(self, user_id: str, body: Dict) -> Optional[Dict]:
        if not self.mgmt_api:
            self.initialize_auth0_mgmt_api()
        try:
            return self.mgmt_api.users.update(id=user_id, body=body)
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to update auth0 user.")

    def send_user_verification_email(
        self, user_id: str, user_identity_id: str, user_provider: str
    ) -> Optional[Dict]:
        if not self.mgmt_api:
            self.initialize_auth0_mgmt_api()
        body = {
            "user_id": user_id,  # user_id of the user to send the verification email to.
            "client_id": self.client_id,
            "identity": {
                "user_id": user_identity_id,  # user_id of the identity to be verified.
                "provider": user_provider,
            },
        }
        return self.mgmt_api.jobs.send_verification_email(body=body)

    def send_user_change_pw(self, user_email: str):
        try:
            result = Database(self.custom_domain).change_password(
                client_id=self.app_client_id,
                email=user_email,
                connection=self.connection,
            )
            return result
        except Exception as e:
            logger.log_exception(e)
            raise BadRequest("Unable to change user password.")

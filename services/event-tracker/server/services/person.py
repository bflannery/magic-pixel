from server.db import db
from server.models import Person, Alias


def get_person_by_email(account_id, email):
    return Person.query.filter_by(account_id=account_id, email=email).first()


def identify_person(account_site_id, new_distinct_id, original_user_id):
    Person(
        named_person=new_distinct_id,
    ).save()

    Alias(named_alias=account_site_id, user_id=original_user_id).save()
    db.session.commit()
    return True

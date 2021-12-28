from magic_pixel.db import db
from magic_pixel.models.person import Person, Alias


def get_person_by_email(account_id, email):
    return Person.query.filter_by(account_id=account_id, email=email).first()


def identify_person(account_id, new_distinct_id, visitor_id):
    new_person = Person(
        account_id=account_id,
        distinct_id=new_distinct_id,
    ).save()

    Alias(person=new_person, original_distinct_id=visitor_id).save()
    db.session.commit()
    return True

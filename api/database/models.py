from .db import db

SEX = ('M', 'F')
class Athlete(db.Document):
    athlete_id =db.IntField(required=True, unique=True)
    access_token = db.StringField(required=True)
    refresh_token = db.StringField(required=True)
    expires_at =db.DateTimeField(required=True)
    first_name = db.StringField(required=True)
    last_name = db.StringField(required=True)
    sex = db.StringField(required=True, choices=SEX)
    
from datetime import datetime
from decouple import config
from bson import ObjectId
import urls
import requests
from database.db import mongo


def get_access_token(athlete_id):

    """
    To prevent excessive polling of the Strava API, before every request to Strava
    we check if the current access token is still valid using the expires_at value stored
    in the database. If it has expired then we request a new one and store it.
    """

    # Get the current details of the athlete
    result = mongo.db.athletes.find_one(
        {"_id": ObjectId(athlete_id)},
        {"access_token": 1, "expires_at": 1, "refresh_token": 1},
    )

    if result:
        access_token = result.get("access_token")
        expires_at = result.get("expires_at")
        # If the token hasn't expired, return the current token
        if datetime.now() < expires_at:
            return access_token
        else:
            # If it's expired, request a new one and return it
            new_access_token = get_new_access_token(
                athlete_id, result.get("refresh_token"), expires_at
            )
            if not new_access_token:
                return False
            else:
                return new_access_token
    else:
        return False


def get_new_access_token(athlete_id, refresh_token, expires_at):
    payload = {
        "client_id": config("STRAVA_CLIENT_ID"),
        "client_secret": config("STRAVA_CLIENT_SECRET"),
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
        "f": "json",
    }

    # post to strava api requesting a new access token (these expire every 6 hours)
    response = requests.post(urls.STRAVA_AUTHORIZE_URL, data=payload, verify=False)

    if response.ok:
        access_token = response.json()["access_token"]
        # update the athletes access_token and new expires_at in the db
        mongo.db.athletes.update(
            {"_id": ObjectId(athlete_id)},
            {
                "$set": {
                    "access_token": access_token,
                    "expires_at": convert_timestamp_to_datetime(
                        response.json()["expires_at"]
                    ),
                }
            },
        )
    else:
        print(f"\n{response.raise_for_status()}\n")
        return False

    return access_token


# Used to convert timestamp of access token expiry to datetime
def convert_timestamp_to_datetime(timestamp):
    return datetime.fromtimestamp(timestamp / 1000)


# Used to convert str of date returned by Strava API to datetime.datetime
def convert_iso_to_datetime(iso_date):
    date = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
    return date.replace(tzinfo=None)


# Used to convert str of date returned by Strava API to datetime.date
def convert_iso_to_date(iso_date):
    date = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
    date = date.replace(tzinfo=None)
    return date.date()
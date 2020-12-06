from flask import Blueprint, Flask, request, Response, abort
from decouple import config
import json
import requests
import urls
from datetime import datetime
from database.db import mongo
from bson import ObjectId

athlete = Blueprint("athlete", __name__)


@athlete.route("/athletes", methods=["POST"])

def post_athlete():
    """
    This endpoint is used when logging in through Strava OAuth, the athlete data received is
    validated, stored in the db and their object id from the db is returned to be used on the 
    fronted
    """
    body = request.get_json()
    strava_id = body.get("strava_id")

    if strava_id:
        if not validate_athlete_data(body):
            return "Error validating athlete's data", 400
    else:
        return "Error obtaining the athlete's id", 400

    # If the athlete already exists, we update their details,
    # if not we create the new athlete document
    upsert = mongo.db.athletes.update(
        {"strava_id": strava_id},
        {
            "$set": {
                "strava_id": strava_id,
                "access_token": body["access_token"],
                "refresh_token": body["refresh_token"],
                "expires_at": convert_iso_to_datetime(body["expires_at"]),
                "first_name": body["first_name"],
                "last_name": body["last_name"],
                "sex": body["sex"],
            }
        },
        upsert=True,
    )

    # Check if upsert updated an existing record or created a new one
    status_code = 200 if upsert.get("updatedExisting") else 201

    # We get the _id of the athlete to be used throughout the app
    athlete = mongo.db.athletes.find_one({"strava_id": strava_id}, {})

    return {"athlete_id": str(athlete.get("_id"))}, status_code


def validate_athlete_data(body):

    """
    The athlete's details should already be valid as they are coming directly from Strava oAuth, however we do some quick
    checks to ensure the data is complete and accurate
    """

    access_token = body.get("access_token")
    refresh_token = body.get("refresh_token")
    expires_at = body.get("expires_at")
    first_name = body.get("first_name")
    last_name = body.get("last_name")
    sex = body.get("sex")

    if (
        access_token
        and refresh_token
        and expires_at
        and first_name
        and last_name
        and sex
    ):
        if not access_token.isalnum():
            return False
        if not refresh_token.isalnum():
            return False
        if not sex in ["M", "F"]:
            return False
        if datetime.now() > convert_iso_to_datetime(expires_at):
            return False
    else:
        return False

    return True


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


def convert_iso_to_datetime(iso_date):
    date = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
    return date.replace(tzinfo=None)


def convert_timestamp_to_datetime(timestamp):
    return datetime.fromtimestamp(timestamp / 1000)

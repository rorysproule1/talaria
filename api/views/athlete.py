from flask import Blueprint, request
from datetime import datetime
from database.db import mongo
from .shared import convert_iso_to_datetime

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

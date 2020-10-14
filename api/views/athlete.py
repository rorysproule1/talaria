from flask import Blueprint, Flask, request, Response
from database.models import Athlete
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
    body = request.get_json()
    strava_id = body["strava_id"]

    # If the athlete already exists, we update their details,
    # if not we create the new athlete instance
    print("\nAttempting to store the athlete's details ...\n")
    mongo.db.athletes.update(
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

    print("\nSucessfully stored the athlete's details!\n")

    # We get the _id of the athlete to be used throughout the app
    athlete = mongo.db.athletes.find_one({"strava_id": strava_id}, {})

    return {"athlete_id": str(athlete.get("_id"))}, 200


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
            print("\nThe current Access Token is still valid!\n")
            return access_token
        else:
            # If it's expired, request a new one and return it
            return get_new_access_token(
                athlete_id, result.get("refresh_token"), expires_at
            )


def get_new_access_token(athlete_id, refresh_token, expires_at):
    payload = {
        "client_id": config("STRAVA_CLIENT_ID"),
        "client_secret": config("STRAVA_CLIENT_SECRET"),
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
        "f": "json",
    }

    # post to strava api requesting a new access token (these expire every 6 hours)
    print("\nRequesting a new Access Token ...\n")
    response = requests.post(urls.STRAVA_AUTHORIZE_URL, data=payload, verify=False)

    if response.ok:
        print("\nReceived a new Access Token!\n")
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
        # output error message
        print("\nAn error occurred when requesting a new Access Token!\n")
        print(f"\n{response.raise_for_status()}\n")

    return access_token


def convert_iso_to_datetime(iso_date):
    date = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
    return date.replace(tzinfo=None)


def convert_timestamp_to_datetime(timestamp):
    return datetime.fromtimestamp(timestamp / 1000)


# @athlete.route("/athletes")
# def get_athletes():
#     athletes = Athlete.objects().to_json()
#     return Response(athlete, mimetype="application/json", status=200)

# @athlete.route("/athletes/<int:athlete_id>", methods=["PUT"])
# def update_athlete(athlete_id):
#     body = request.get_json()
#     Athlete.objects.get(athlete_id=athlete_id).update(**body)
#     return "", 200


# @athlete.route("/athletes/<int:athlete_id>", methods=["DELETE"])
# def delete_athlete(athlete_id):
#     Athlete.objects.get(athlete_id=athlete_id).delete()
#     return "", 200


# @athlete.route("/athletes/<int:athlete_id>")
# def get_athlete(athlete_id):
#     athlete = Athlete.objects.get(athlete_id=athlete_id).to_json()
#     return Response(athlete, mimetype="application/json", status=200)

from flask import Blueprint, Flask, request, Response
from database.models import Athlete
from decouple import config
import json
import datetime
import requests
import urls
from datetime import datetime as dt

athlete = Blueprint("athlete", __name__)


@athlete.route("/athletes")
def get_athletes():
    athletes = Athlete.objects().to_json()
    return Response(athlete, mimetype="application/json", status=200)


@athlete.route("/athletes", methods=["POST"])
def post_athlete():
    body = request.get_json()
    athlete_id = body["athlete_id"]
    # If the athlete already exists, we update their access_token and expires_at, if not we create the new athlete instance
    Athlete.objects(athlete_id=athlete_id).update_one(**body, upsert=True)
    return {"athlete_id": str(athlete_id)}, 200


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


def get_access_token(athlete_id):
    athlete = Athlete.objects.get(athlete_id=athlete_id)
    return athlete["access_token"]


@athlete.route("/test/<int:athlete_id>")
def test(athlete_id):

    """
    To prevent excessive polling of the Strava API, before every request to Strava
    we check if the current access token is still valid using the expires_at value stored
    in the database. If it has expired then we request a new one and store it.
    """

    athlete = json.loads(
        Athlete.objects.only("access_token", "expires_at", "refresh_token")
        .get(athlete_id=athlete_id)
        .to_json()
    )
    expires_at = datetime.datetime.fromtimestamp(
        athlete["expires_at"]["$date"] / 1000
    ).strftime("%c")

    print(athlete["access_token"])

    if dt.now().strftime("%c") > expires_at:
        return athlete["access_token"]
    else:
        new_token = get_new_access_token(athlete["refresh_token"])

    return {"old": athlete["access_token"], "new": new_token}

@athlete.route("/tests")
def get_new_access_token():
    payload = {
        "client_id": config("STRAVA_CLIENT_ID"),
        "client_secret": config("STRAVA_CLIENT_SECRET"),
        "refresh_token": "ffe49125a7e3bd65b09d126da69105da1e6a9077",
        "grant_type": "refresh_token",
        "f": "json",
    }

    # post to strava api requesting a new access token (these expire every 6 hours)
    response = requests.post(urls.STRAVA_AUTHORIZE_URL, data=payload, verify=False)

    if response.ok:
        access_token = response.json()
    else:
        # output error message
        print("\nError when requesting Access Token ...\n")
        print(f"\n{response.raise_for_status()}\n")


    return access_token
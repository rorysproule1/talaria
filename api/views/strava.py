import logging
import os
import time

import requests
import urls
from decouple import config
from flask import Blueprint, Flask, request
from datetime import datetime
import datetime as time

strava = Blueprint("strava", __name__)

@strava.route("/strava-insights", methods=["GET"])
def get_strava_insights():

    """
    This endpoint is used to gather insights into an athlete's history on Strava
    to provide suggestions to the athlete when they are creating a new training plan
    """

    access_token = request.args.get("access_token")
    header = {"Authorization": f"Bearer {access_token}"}
    params = {"per_page": 100, "page": 1}

    # get all athlete activities from strava api
    print("\nRequesting athlete activities ...\n")
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)
    print("\nReceived athlete activities!\n")

    completed_5km, completed_10km, completed_half_marathon, completed_marathon = (
        False,
        False,
        False,
        False,
    )
    (
        fastest_5km,
        fastest_10km,
        fastest_half_marathon,
        fastest_marathon,
        total_runs,
        total_distance,
    ) = (
        0,
        0,
        0,
        0,
        0,
        0,
    )
    additional_activities = set()
    timestamp = get_epoch_timestamp()

    for activity in response.json():
        if activity["type"] == "Run":
            total_runs += 1
            total_distance = total_distance + activity["distance"]
            first_run_date = activity["start_date"]
            if 5000 <= activity["distance"] <= 5500:
                completed_5km = True
                if activity["elapsed_time"] < fastest_5km or fastest_5km == 0:
                    fastest_5km = activity["elapsed_time"]
                continue
            if 10000 <= activity["distance"] <= 10500:
                completed_10km = True
                if activity["elapsed_time"] < fastest_10km or fastest_10km == 0:
                    fastest_10km = activity["elapsed_time"]
                continue
            if 21097 <= activity["distance"] <= 21597:
                completed_half_marathon = True
                if (
                    activity["elapsed_time"] < fastest_half_marathon
                    or fastest_half_marathon == 0
                ):
                    fastest_half_marathon = activity["elapsed_time"]
                continue
            if 42195 <= activity["distance"] <= 42695:
                completed_marathon = True
                if activity["elapsed_time"] < fastest_marathon or fastest_marathon == 0:
                    fastest_marathon = activity["elapsed_time"]
                continue
        else:
            additional_activities.add(activity["type"])

    weeks = get_total_weeks(first_run_date)

    return {
        "completed_5km": completed_5km,
        "completed_10km": completed_10km,
        "completed_half_marathon": completed_half_marathon,
        "completed_marathon": completed_marathon,
        "fastest_5km": str(time.timedelta(seconds=fastest_5km)),
        "fastest_10km": str(time.timedelta(seconds=fastest_10km)),
        "fastest_half_marathon": str(time.timedelta(seconds=fastest_half_marathon)),
        "fastest_marathon": str(time.timedelta(seconds=fastest_marathon)),
        "additional_activities": list(additional_activities),
        "runs_per_week": round(total_runs / weeks),
        "distance_per_week": round(total_distance / weeks) / 1000,
    }


def get_epoch_timestamp():
    dt = datetime.now()
    try:
        dt = dt.replace(month=dt.year - 1)
    except ValueError:
        dt = dt.replace(year=dt.year - 1, day=dt.day - 1)

    return dt.timestamp()


def get_total_weeks(starting_date):

    # Convert date string of the altheltes first recorded run to compatable datetime
    start_date = datetime.fromisoformat(starting_date.replace("Z", "+00:00"))
    start_date = start_date.replace(tzinfo=None)

    current_date = datetime.now()
    total_weeks = (current_date - start_date).days / 7

    return total_weeks


@strava.route("/activities")
def get_activities():

    access_token = check_for_new_access_token()

    header = {"Authorization": f"Bearer {access_token}"}
    params = {"per_page": 100, "page": 1}

    # get all athlete activities from strava api
    print("\nRequesting athlete activities ...\n")
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    return {"activities": response.json()}


@strava.route("/authorize")
def get_access_token():
    payload = {
        "client_id": config("STRAVA_CLIENT_ID"),
        "client_secret": config("STRAVA_CLIENT_SECRET"),
        "refresh_token": config("STRAVA_REFRESH_TOKEN"),
        "grant_type": "refresh_token",
        "f": "json",
    }

    # post to strava api requesting a new access token (these expire every 6 hours)
    print("\nRequesting Access Token ...\n")
    response = requests.post(urls.STRAVA_AUTHORIZE_URL, data=payload, verify=False)

    if response.ok:
        access_token = response.json()["access_token"]
        print(f"\nReceived Access Token - {access_token}\n")
        # set the env variable to the new access token for later use
        os.environ["STRAVA_ACCESS_TOKEN"] = access_token
    else:
        # output error message
        print("\nError when requesting Access Token ...\n")
        print(f"\n{response.raise_for_status()}\n")

    return {"access_token": access_token}


def check_for_new_access_token():
    """
    To reduce the number of polls to the strava api, we only request a new access token
    if there isn't currently one stored in the app
    """
    if not os.environ.get("STRAVA_ACCESS_TOKEN"):
        return get_access_token()["access_token"]
    else:
        return config("STRAVA_ACCESS_TOKEN")


@strava.route("/averages")
def get_averages():

    access_token = check_for_new_access_token()

    header = {"Authorization": f"Bearer {access_token}"}
    params = {"per_page": 100, "page": 1}

    # get all athlete activities from strava api
    print("\nRequesting athlete activities ...\n")
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    average_distance = 0
    total_runs = 0
    average_moving_time = 0

    for activity in response.json():
        if activity["type"] == "Run":
            average_distance = average_distance + activity["distance"]
            average_moving_time = average_moving_time + activity["moving_time"]
            total_runs += 1

    total_distance = average_distance
    average_distance = average_distance / total_runs
    average_moving_time = average_moving_time / total_runs

    return {
        "average_moving_time": round(average_moving_time / 60, 2),
        "average_distance": round(average_distance, 2),
        "total_runs": total_runs,
        "total_distance": round(total_distance, 2),
    }

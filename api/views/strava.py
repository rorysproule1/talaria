import logging
import os
import time

from .athlete import get_access_token
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
    access_token = get_access_token(int(request.args.get("athlete_id")))
    print("--------------------------------------------------\n")
    print(access_token + "\n")
    header = {"Authorization": f"Bearer {access_token}"}
    params = {"per_page": 100, "page": 1}

    # get all athlete activities from strava api
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

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

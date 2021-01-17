import time
import math

from .athlete import get_access_token
import requests
import urls
from decouple import config
from flask import Blueprint, Flask, request, abort, jsonify, make_response
from datetime import datetime
import datetime as time
from .athlete import convert_iso_to_datetime
from bson import ObjectId

strava = Blueprint("strava", __name__)


@strava.route("/strava-insights", methods=["GET"])
def get_strava_insights():

    """
    This endpoint is used to gather data points on an athlete's history on Strava
    to provide insightful suggestions to the athlete when they are creating a new training plan
    """
    
    athlete_id = request.args.get("athlete_id")
    if not athlete_id:
        return "An error occurred when getting the athlete's id", 400

    # Get all athlete activities from strava api
    activities = get_activities(athlete_id)
    if not activities:
        return "An error occurred when requesting the athlete's activities", 500

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

    # Analyse each activity for insights
    for activity in activities:
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
    }, 200


@strava.route("/dashboard", methods=["GET"])
def get_dashboard_data():

    """
    This endpoint is used to get all of the athlete's strava data that is displayed on the Dashboard
    It contains data such as their latest run data and their last 7 days running data
    """

    athlete_id = request.args.get("athlete_id")
    if not athlete_id:
        return "An error occurred when getting the athlete's id", 400

    activities = get_activities(athlete_id)
    if not activities:
        return "An error occurred when requesting the athlete's activities", 500

    latest_run = {}
    today = time.date.today()
    last_week = [
        {
            "day": str(today - time.timedelta(days=6)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today - time.timedelta(days=5)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today - time.timedelta(days=4)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today - time.timedelta(days=3)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today - time.timedelta(days=2)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today - time.timedelta(days=1)),
            "distance": 0,
            "time": 0,
        },
        {
            "day": str(today),
            "distance": 0,
            "time": 0,
        },
    ]
    for activity in activities:
        if activity["type"] == "Run":

            # If this run was in the last week, add it's data to the last week [{}]
            for day in last_week:
                if activity["start_date"].startswith(day["day"]):
                    day["distance"] = round(activity["distance"] / 1000, 2)
                    day["time"] = math.floor(activity["elapsed_time"] / 60)

            # If this is the first run found, add it's data as the latest run
            if not latest_run:
                elapsed_time = str(time.timedelta(seconds=activity["elapsed_time"]))
                if elapsed_time.startswith("0:"):
                    elapsed_time = elapsed_time[2:]

                distance = round(activity["distance"] / 1000, 2)

                speed = str(
                    time.timedelta(
                        seconds=math.floor(activity["moving_time"] / distance)
                    )
                )
                if speed.startswith("0:"):
                    speed = speed[2:]

                latest_run = {
                    "title": activity["name"],
                    "date": convert_iso_to_datetime(activity["start_date"]),
                    "time": elapsed_time,
                    "distance": distance,
                    "speed": speed,
                }
    return {"latest_run": latest_run, "last_week": last_week}, 200


def get_activities(athlete_id):

    """
    Function to call the Strava API and return all the activities the athlete has recorded to date
    """

    header = {"Authorization": f"Bearer {get_access_token(athlete_id)}"}
    params = {"per_page": 100, "page": 1}

    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    if response.ok:
        return response.json()
    else:
        print(f"\n{response.raise_for_status()}\n")
        return False


def get_epoch_timestamp():
    dt = datetime.now()
    try:
        dt = dt.replace(month=dt.year - 1)
    except ValueError:
        dt = dt.replace(year=dt.year - 1, day=dt.day - 1)

    return dt.timestamp()


def get_total_weeks(starting_date):
    current_date = datetime.now()
    total_weeks = (current_date - convert_iso_to_datetime(starting_date)).days / 7

    return total_weeks

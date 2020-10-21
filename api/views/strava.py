import logging
import os
import time
import math

from .athlete import get_access_token
import requests
import urls
from decouple import config
from flask import Blueprint, Flask, request, abort
from datetime import datetime
import datetime as time
from .athlete import convert_iso_to_datetime
from werkzeug.exceptions import HTTPException, NotFound

strava = Blueprint("strava", __name__)


@strava.route("/strava-insights", methods=["GET"])
def get_strava_insights():

    """
    This endpoint is used to gather data points on an athlete's history on Strava
    to provide insightful suggestions to the athlete when they are creating a new training plan
    """
    access_token = get_access_token(request.args.get("athlete_id"))
    if not access_token:
        return "An error occurred when requesting a new access token", 500

    # Get all athlete activities from strava api
    activities = get_activities(access_token)
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
def get_recent_run():

    """
    This endpoint is used to get all of the athlete's strava data that is displayed on the Dashboard
    It contains data such as their most recent run data
    """

    access_token = get_access_token(request.args.get("athlete_id"))
    if not access_token:
        return "An error occurred when requesting a new access token", 500

    # Get all athlete activities from strava api
    activities = get_activities(access_token)
    if not activities:
        return "An error occurred when requesting the athlete's activities", 500

    recent_run = {}
    for activity in activities:
        if activity["type"] == "Run":
            elapsed_time = str(time.timedelta(seconds=activity["elapsed_time"]))
            if elapsed_time.startswith("0:"):
                elapsed_time = elapsed_time[2:]

            distance = round(activity["distance"] / 1000, 2)

            speed = str(
                time.timedelta(seconds=math.floor(activity["moving_time"] / distance))
            )
            if speed.startswith("0:"):
                speed = speed[2:]

            return {
                "title": activity["name"],
                "date": convert_iso_to_datetime(activity["start_date"]),
                "time": elapsed_time,
                "distance": distance,
                "speed": speed,
            }, 200


def get_activities(access_token):

    """
    Function to call the Strava API and return all the activities the athlete has recorded to date
    """

    header = {"Authorization": f"Bearer {access_token}"}
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

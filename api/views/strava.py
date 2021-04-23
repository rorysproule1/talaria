import time
import math
import requests
import urls
from flask import Blueprint, request
from datetime import datetime
from datetime import date
import datetime as time
from .shared import convert_iso_to_date, convert_iso_to_datetime, get_access_token
from collections import Counter

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
    activities = get_strava_activities(athlete_id)
    if not activities:
        return "An error occurred when requesting the athlete's activities", 500

    # Set default values for all insight variables required
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
        runs_per_week_total,
    ) = (
        0,
        0,
        0,
        0,
        0,
    )
    date_5km, date_10km, date_half_marathon, date_marathon = None, None, None, None
    additional_activities = set()
    six_weeks_ago = time.date.today() - time.timedelta(weeks=6)
    long_run_day_list = []
    long_run_day = 7

    # Analyse each activity for insights
    for activity in activities:
        if activity["type"] == "Run":

            run_date = convert_iso_to_date(activity["start_date"])
            run_distance = activity["distance"]

            # If the run is in the last 6 weeks, add it to runs per week calculation
            if run_date > six_weeks_ago:
                runs_per_week_total += 1

            # Check the distance of the run, and check if it is a PB or distance achievement
            if run_distance >= 42195:
                (
                    completed_5km,
                    completed_10km,
                    completed_half_marathon,
                    completed_marathon,
                ) = (True, True, True, True)
                date_5km = set_date(date_5km, run_date)
                date_10km = set_date(date_10km, run_date)
                date_half_marathon = set_date(date_half_marathon, run_date)
                date_half_marathon = set_date(date_marathon, run_date)
                if run_distance <= 42695:  # Marathon
                    if (
                        activity["elapsed_time"] < fastest_marathon
                        or fastest_marathon == 0
                    ):
                        fastest_marathon = activity["elapsed_time"]
            elif run_distance >= 21097:
                completed_5km, completed_10km, completed_half_marathon = (
                    True,
                    True,
                    True,
                )
                date_5km = set_date(date_5km, run_date)
                date_10km = set_date(date_10km, run_date)
                date_half_marathon = set_date(date_half_marathon, run_date)
                if run_distance <= 21597:  # Half-Marathon
                    if (
                        activity["elapsed_time"] < fastest_half_marathon
                        or fastest_half_marathon == 0
                    ):
                        fastest_half_marathon = activity["elapsed_time"]
            elif run_distance >= 10000:
                completed_5km, completed_10km = True, True
                date_5km = set_date(date_5km, run_date)
                date_10km = set_date(date_10km, run_date)
                if run_distance <= 10500:  # 10KM
                    if activity["elapsed_time"] < fastest_10km or fastest_10km == 0:
                        fastest_10km = activity["elapsed_time"]
            elif run_distance >= 5000:
                completed_5km = True
                date_5km = set_date(date_5km, run_date)
                if run_distance <= 5500:  # 5KM
                    if activity["elapsed_time"] < fastest_5km or fastest_5km == 0:
                        fastest_5km = activity["elapsed_time"]
            if run_distance >= 10000:
                long_run_day_list.append(run_date.weekday())
        else:
            # If the activity isn't a run, add it to additional activites set
            additional_activities.add(activity["type"])

    # Get most popular long run day
    if long_run_day_list:
        long_run_day = get_long_run_day(long_run_day_list)

    return {
        "five_km": {
            "completed": completed_5km,
            "time": get_time_string(fastest_5km),
            "date": date_5km,
        },
        "ten_km": {
            "completed": completed_10km,
            "time": get_time_string(fastest_10km),
            "date": date_10km,
        },
        "half_marathon": {
            "completed": completed_half_marathon,
            "time": get_time_string(fastest_half_marathon),
            "date": date_half_marathon,
        },
        "marathon": {
            "completed": completed_marathon,
            "time": get_time_string(fastest_marathon),
            "date": date_marathon,
        },
        "additional_activities": list(additional_activities),
        "runs_per_week": round(runs_per_week_total / 6, 2),
        "long_run_day": get_day_string(long_run_day),
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

    activities = get_strava_activities(athlete_id)
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

        # If a latest run is recorded and the activity is over a week old, end the loop
        days_ago = datetime.now() - convert_iso_to_datetime(activity["start_date"])
        if latest_run and days_ago.days > 7:
            break

        if activity["type"] == "Run":

            # If this run was in the last week, add it's data to the last week [{}]
            if days_ago.days <= 7:
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

        for day in last_week:
            date = datetime.strptime(day["day"], "%Y-%m-%d").date()
            day["day"] = date.strftime('%d/%m/%Y')

        
    return {"latest_run": latest_run, "last_week": last_week}, 200


def get_strava_activities(athlete_id):

    """
    Function to call the Strava API and return all the activities the athlete has recorded to date
    """

    header = {"Authorization": f"Bearer {get_access_token(athlete_id)}"}
    params = {"per_page": 200, "page": 1}

    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    if response.ok:
        activity_list = response.json()

        # If 200 activites are found, must loop until all activites are gathered
        if len(activity_list) == 200:
            page = 2
            while True:
                batch = requests.get(
                    urls.STRAVA_ACTIVITIES_URL,
                    headers=header,
                    params={"per_page": 200, "page": page},
                )
                batch_list = batch.json()
                for activity in batch_list:
                    activity_list.append(activity)
                if len(batch_list) != 200:
                    break
                else:
                    page += 1

        return activity_list
    else:
        print(f"\n{response.raise_for_status()}\n")
        return False


def set_date(existing_date, run_date):
    if not existing_date:
        return date(
            day=run_date.day,
            month=run_date.month,
            year=run_date.year,
        ).strftime("%A, %d %B %Y")
    else:
        return existing_date


def get_long_run_day(day_list):
    data = Counter(day_list)
    day_count_list = data.most_common()
    if day_count_list:
        most_common_day = day_count_list[0][0]
        most_common_count = day_count_list[0][1]
    else:
        return None

    # If the most common day is a weekday, check if a weekend has the same number of long runs
    if most_common_day not in [5, 6]:
        for day, count in day_count_list:
            if count == most_common_count and day in [5, 6]:
                return day
            elif count != most_common_count:
                break

    return most_common_day


def get_blockable_days(day_list):
    data = Counter(day_list)
    day_count_list = data.most_common()
    print(day_count_list)
    return [
        day_count_list[6][0],
        day_count_list[5][0],
        day_count_list[4][0],
        day_count_list[3][0],
    ]


def get_epoch_timestamp():
    dt = datetime.now()
    try:
        dt = dt.replace(month=dt.year - 1)
    except ValueError:
        dt = dt.replace(year=dt.year - 1, day=dt.day - 1)

    return dt.timestamp()


def get_time_string(run_time):
    time_string = str(time.timedelta(seconds=run_time))
    if time_string.startswith("0:"):
        time_string = time_string[2:]

    return time_string


def get_day_string(day):
    if day == 0:
        return "Monday"
    elif day == 1:
        return "Tuesday"
    elif day == 2:
        return "Wednesday"
    elif day == 3:
        return "Thursday"
    elif day == 4:
        return "Friday"
    elif day == 5:
        return "Saturday"
    elif day == 6:
        return "Sunday"
    else:
        return None


def get_day_strings(days):
    day_list = []

    for day in days:
        if day == 0:
            day_list.append("Monday")
        elif day == 1:
            day_list.append("Tuesday")
        elif day == 2:
            day_list.append("Wednesday")
        elif day == 3:
            day_list.append("Thursday")
        elif day == 4:
            day_list.append("Friday")
        elif day == 5:
            day_list.append("Saturday")
        elif day == 6:
            day_list.append("Sunday")

    return day_list
from flask import Blueprint, request
from datetime import datetime

from database.db import mongo
from .strava import get_strava_activities
from .shared import convert_iso_to_date, convert_iso_to_datetime
import datetime as time
import math
from bson import ObjectId

plan = Blueprint("plan", __name__)


@plan.route("/plans/<string:athlete_id>", methods=["GET"])
def get_all_plans(athlete_id):

    """
    This endpoint is used to get all the existing training plans a runner has created to be
    displayed on their dashboard, along with a short bit of data on each
    """

    try:
        cursor = mongo.db.plans.find({"athlete_id": athlete_id})
    except Exception as e:
        return "An error occurred when getting athlete's plans", 500

    result = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        result.append(doc)

    return {"plans": result}, 200


@plan.route("/plan/<string:plan_id>", methods=["GET"])
def get_one_plan(plan_id):

    """
    This endpoint is used to get the specified training plan selected by the user.
    """

    plan = mongo.db.plans.find_one({"_id": ObjectId(plan_id)})

    if plan is not None:
        plan["_id"] = str(plan["_id"])
        return plan, 200
    else:
        return "No plan was found with this ID", 404


@plan.route("/plans", methods=["POST"])
def post_plan():

    """
    This endpoint is used to post a proposed plan frin the plan creation flow, the details of it are
    validated and then the plan activities are generated. It is stored in the plan collection.
    """

    body = request.get_json()
    athlete_id = body.get("athlete_id")

    # if athlete_id:
    #     if not validate_plan_data(body):
    #         return "An error occurred when validating the plan details", 400
    # else:
    #     return "An error occurred when getting the athlete's id", 400

    body["activities"] = generate_plan_activities(athlete_id, body)

    try:
        mongo.db.plans.insert_one(body)
    except Exception as e:
        return "An error occurred when adding the new plan", 500

    return body, 201


def validate_plan_data(body):
    distance = body.get("distance")
    goal_type = body.get("goal_type")
    runs_per_week = body.get("runs_per_week")
    goal_time = body.get("goal_time")
    start_date = body.get("start_date")
    finish_date = body.get("finish_date")
    include_taper = (body.get(" include_taper"),)
    include_cross_train = (body.get("include_cross_train"),)
    long_run_day = body.get("long_run_day")
    blocked_days = body.get("blocked_days")

    if distance and goal_type and runs_per_week:
        if distance not in ["5KM", "10KM", "HALF-MARATHON", "MARATHON"]:
            return False
        if goal_type not in ["DISTANCE", "TIME"] or (
            goal_type == "TIME" and not goal_time
        ):
            return False
        if runs_per_week not in ["2-3", "4-5", "6+"]:
            return False
        if finish_date:
            if datetime.datetime.now() > convert_iso_to_datetime(finish_date):
                return False
        if long_run_day:
            if long_run_day in blocked_days:
                return False
        if blocked_days:
            if (
                (runs_per_week == "2-3" and len(blocked_days) > 4)
                or (runs_per_week == "4-5" and len(blocked_days) > 2)
                or (runs_per_week == "6+" and len(blocked_days) > 1)
            ):
                return False
    else:
        return False

    return True


def generate_plan_activities(athlete_id, plan):

    """
    This is the key function used to generate the activities of the plan based off the details provided by the athlete
    """

    # Get all the relevant info from the plan data provided by the athlete
    plan = {
        "distance": plan.get("distance"),
        "goal_type": plan.get("goal_type"),
        "runs_per_week": plan.get("runs_per_week"),
        "goal_time": plan.get("goal_time"),
        "start_date": plan.get("start_date"),
        "finish_date": plan.get("finish_date"),
        "include_taper": plan.get("include_taper"),
        "long_run_day": plan.get("long_run_day"),
        "blocked_days": plan.get("blocked_days"),
    }
    plan["blocked_days"] = convert_blocked_days(plan["blocked_days"])

    # Get all the athlete's past strava activities
    strava_activities = get_strava_activities(str(athlete_id))

    # Create insights from these activities to help in plan generation
    insights = get_insights(strava_activities, plan["distance"])

    # Generate the activites for the plan based off both the plan details and strava insights
    plan_activities = generate_activities(plan, insights)

    # Allocate these activities to their appropriate dates, using the preferences set in the plan details 
    plan_activities = allocate_activity_dates(plan_activities, plan)

    return plan_activities


def get_insights(activities, plan_distance):

    twelve_weeks_ago = time.date.today() - time.timedelta(weeks=12)
    max_distance = 0
    total_distance = 0
    number_of_runs = 0
    ran_distance_before = False
    plan_distance = get_distance_float(plan_distance)
    avg_speed = 0

    for activity in activities:
        if activity["type"] == "Run":
            run_date = convert_iso_to_date(activity["start_date"])

            if activity["distance"] >= plan_distance:
                ran_distance_before = True

            # Look at the last 12 weeks
            if run_date > twelve_weeks_ago:
                if activity["distance"] > max_distance:
                    max_distance = activity["distance"]

                avg_speed += activity["average_speed"]
                total_distance += activity["distance"]
                number_of_runs += 1

    avg_ms = avg_speed / number_of_runs

    return {
        "avg_weekly_distance": round(total_distance / 12, 2),
        "max_distance": max_distance,
        "avg_run_distance": round(total_distance / number_of_runs, 2),
        "avg_run_time": 0,
        "easy_pace": calculate_time_per_km(avg_ms),
        "avg_pace": calculate_time_per_km(avg_ms * 1.1),
        "fast_pace": calculate_time_per_km(avg_ms * 0.9),
        "ran_distance_before": ran_distance_before,
    }


def calculate_time_per_km(metres_per_second):
    sec_km = math.floor(1000 / metres_per_second)
    min_km = math.floor(sec_km / 60)
    min_sec_per_km = f"{min_km}.{ sec_km % 60}"

    return float(min_sec_per_km)


def generate_activities(plan, insights):
    plan_activities = []

    if plan["goal_type"] == "DISTANCE":
        plan_activities = generate_distance_plan(plan, insights)
    elif plan["goal_type"] == "TIME":
        plan_activities = generate_time_plan(plan, insights)

    return plan_activities


def generate_distance_plan(plan, insights):

    return generate_c25k_activities()

    if plan["distance"] == "5K" and not insights["ran_distance_before"]:
        return generate_c25k_activities()
    else:
        if plan["distance"] == "HALF-MARATHON":
            max_long_run_distance = 16

        elif plan["distance"] == "HALF-MARATHON":
            max_long_run_distance = 20
            base_run_distance = insights["avg_run_distance"]
            long_run_distance = math.ceil(base_run_distance * 1.5)
            base_run_time = insights["avg_run_time"]
            base_long_run_time = math.ceil(base_run_time * 1.5)


def generate_time_plan(plan, insights):
    a = 1


def allocate_activity_dates(activities, plan):

    # We take the start date as the current date
    current_date = convert_iso_to_date(plan["start_date"])
    current_date = datetime.combine(current_date, datetime.min.time())
    current_day = current_date.weekday()
    active_yesterday = False
    active_streak = 0

    # Loop through all the generated activities
    for activity in activities:
        activity_assigned = False
        # Loop until the activity is assigned to a date
        while not activity_assigned:
            if current_day not in plan["blocked_days"]:
                # With 2-3 rpw, we take a rest day between runs
                if plan["runs_per_week"] == "2-3":
                    if not active_yesterday:
                        activity["date"] = current_date
                        active_yesterday = True
                        active_streak += 1
                        activity_assigned = True
                    else:
                        active_yesterday = False
                        active_streak += 0
                if plan["runs_per_week"] == "4-5":
                    # With 2-4 rpw, we take a rest day after 2 consecutive runs
                    if active_streak < 2:
                        activity["date"] = current_date
                        active_yesterday = True
                        active_streak += 1
                        activity_assigned = True
                    else:
                        active_streak = 0
                        active_yesterday = False
                if plan["runs_per_week"] == "6+":
                    # With 6+ rpw, if its a half or full marathon, the long run will deal with the rest day
                    if plan["distance"] in ["HALF-MARATHON", "MARATHON"]:
                        activity["date"] = current_date
                        active_yesterday = True
                        active_streak += 1
                        activity_assigned = True
                    else:
                        # Otherwise, don't allow more than 4 consecutive runs
                        if active_streak < 4:
                            activity["date"] = current_date
                            active_yesterday = True
                            active_streak += 1
                            activity_assigned = True
                        else:
                            active_streak = 0
                            active_yesterday = False
            else:
                active_streak = 0
                active_yesterday = False

            # Increment date + day of the week
            # There is also a rest day after a long run so we skip the next day
            if activity["run_type"] != "LONG":
                current_day = increment_day(current_day, False)
                current_date = current_date + time.timedelta(days=1)
            else:
                current_day = increment_day(current_day, True)
                current_date = current_date + time.timedelta(days=2)
                active_yesterday = False
                active_streak = 0

    return activities


def increment_day(day, long_run):
    if long_run:
        if day == 6:
            return 1
        if day == 5:
            return 0
        else:
            return day + 2
    else:
        if day == 6:
            return 0
        else:
            return day + 1


def generate_c25k_activities():

    # Using NHS C25K - https://www.nhs.uk/live-well/exercise/couch-to-5k-week-by-week/

    activities = [
        # Week 1
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "60 seconds running with 90 seconds walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "60 seconds running with 90 seconds walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "60 seconds running with 90 seconds walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 2
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "90 seconds running with 2 minutes walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "90 seconds running with 2 minutes walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "90 seconds running with 2 minutes walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 3
        {
            "run_type": "BASE",
            "time": "18 Mins",
            "description": "2x 90 seconds of running, 90 seconds of walking, 3 minutes of running, 3 minutes of walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "18 Mins",
            "description": "2x 90 seconds of running, 90 seconds of walking, 3 minutes of running, 3 minutes of walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "18 Mins",
            "description": "2x 90 seconds of running, 90 seconds of walking, 3 minutes of running, 3 minutes of walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 4
        {
            "run_type": "BASE",
            "time": "21.5 Mins",
            "description": "3 minutes of running, 90 seconds walking, 5 minutes running, 2 ½ minutes walking, 3 minutes running, 90 seconds walking, 5 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "21.5 Mins",
            "description": "3 minutes of running, 90 seconds walking, 5 minutes running, 2 ½ minutes walking, 3 minutes running, 90 seconds walking, 5 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "21.5 Mins",
            "description": "3 minutes of running, 90 seconds walking, 5 minutes running, 2 ½ minutes walking, 3 minutes running, 90 seconds walking, 5 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 5
        {
            "run_type": "BASE",
            "time": "21 Mins",
            "description": "5 minutes running, 3 minutes walking, 5 minutes running, 3 minutes walking, 5 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "21 Mins",
            "description": "8 minutes running, 5 minutes walking, 8 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "20 Mins",
            "description": "20 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 6
        {
            "run_type": "BASE",
            "time": "24 Mins",
            "description": "5 minutes running, 3 minutes walking, 8 minutes running, 3 minutes walking, 5 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "23 Mins",
            "description": "10 minutes running, 3 minutes walking, 10 minutes running",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "25 Mins",
            "description": "25 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 7
        {
            "run_type": "BASE",
            "time": "25 Mins",
            "description": "25 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "25 Mins",
            "description": "25 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "25 Mins",
            "description": "25 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 8
        {
            "run_type": "BASE",
            "time": "28 Mins",
            "description": "28 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "25 Mins",
            "description": "28 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "28 Mins",
            "description": "28 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        # Week 9
        {
            "run_type": "BASE",
            "time": "30 Mins",
            "description": "28 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "30 Mins",
            "description": "30 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
        {
            "run_type": "BASE",
            "time": "30 Mins",
            "description": "30 minutes running, with no walking",
            "date": None,
            "completed": False,
            "missed": False
        },
    ]

    return activities


def get_distance_float(distance):
    if distance == "5K":
        return 5.0
    elif distance == "10K":
        return 10.0
    elif distance == "HALF-MARATHON":
        return 21.1
    elif distance == "MARATHON":
        return 42.2


def convert_blocked_days(blocked_days):
    blocked_list = []
    for day in blocked_days:
        if day == "Monday":
            blocked_list.append(0)
        elif day == "Tuesday":
            blocked_list.append(1)
        elif day == "Wednesday":
            blocked_list.append(2)
        elif day == "Thursday":
            blocked_list.append(3)
        elif day == "Friday":
            blocked_list.append(4)
        elif day == "Saturday":
            blocked_list.append(5)
        elif day == "Sunday":
            blocked_list.append(6)

    return blocked_list

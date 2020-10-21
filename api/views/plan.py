from flask import Blueprint, Flask, request, Response, abort
from decouple import config
import json
import requests
import urls
import datetime
from database.db import mongo
from bson import ObjectId
from .athlete import convert_iso_to_datetime

plan = Blueprint("plan", __name__)


@plan.route("/plans", methods=["POST"])
def post_plan():
    body = request.get_json()
    athlete_id = body.get("athlete_id")

    if athlete_id:
        if not validate_plan_data(body):
            return "Error validating athlete's data", 400
    else:
        return "Error obtaining the athlete's id", 400

    try:
        insert = mongo.db.plans.insert_one(body)
    except Exception as e:
        return "An error occurred when adding the new plan", 500

    return "Plan added successfully!", 201


@plan.route("/plans/<string:athlete_id>", methods=["GET"])
def get_all_plans(athlete_id):

    try:
        cursor = mongo.db.plans.find({"athlete_id": athlete_id})
    except Exception as e:
        return "An error occurred when getting athlete's plans", 500

    result = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        result.append(doc)

    return {"plans": result}, 200


def validate_plan_data(body):
    distance = body.get("distance")
    goal_type = body.get("goal_type")
    runs_per_week = body.get("runs_per_week")
    goal_time = body.get("goal_time")
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

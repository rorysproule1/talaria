from flask import Blueprint, Flask, request, Response, abort
from decouple import config
import json
import requests
import urls
from datetime import datetime
from database.db import mongo
from bson import ObjectId

plan = Blueprint("plan", __name__)


@plan.route("/plans", methods=["POST"])
def post_plan():
    body = request.get_json()
    athlete_id = body.get("athlete_id")

    if athlete_id:
        validate_plan_data(body)
    else:
        abort(400, description="An error occurred when getting the athlete's id")

    print("\nAttempting to store the plan details ...\n")
    insert = mongo.db.plans.insert_one(body)

    return "Plan created successfully!", 201

@plan.route("/plans//<string:athlete_id>", methods=["GET"])
def get_all_plans(athlete_id):
    
    print("\nAttempting to get the athlete's plans ...\n")
    cursor = mongo.db.plans.find({"athlete_id": athlete_id})
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
    include_taper = body.get(" include_taper"),
    include_cross_train = body.get("include_cross_train"),
    long_run_day = body.get("long_run_day")
    blocked_days = body.get("blocked_days")

    if distance and goal_type and runs_per_week:
        if distance not in ["5KM", "10KM", "HALF-MARATHON", "MARATHON"] or not isinstance(distance, str):
            abort(
                400,
                description="An error occurred as the distance provided is invalid",
            )
        if goal_type not in ["DISTANCE", "TIME"] or (
            goal_type == "TIME" and not goal_time
        ) or not isinstance(goal_type, str):
            abort(
                400,
                description="An error occurred as the goal type provided is invalid",
            )
        if runs_per_week not in ["2-3", "4-5", "6+"] or not isinstance(runs_per_week, str):
            abort(
                400,
                description="An error occurred as the runs per week provided is invalid",
            )
        # if datetime.now() > finish_date:
        #     abort(
        #         400,
        #         description="An error occurred as the finish date provided is invalid",
        #     )
        # if long_run_day in blocked_days or not isinstance(long_run_day, str):
        #     abort(
        #         400,
        #         description="An error occurred as the long run day provided is invalid",
        #     )
        # if not isinstance(include_cross_train, bool):
        #     abort(
        #         400,
        #         description="An error occurred as the include cross train provided is invalid",
        #     )
        # if not isinstance(include_taper, bool):
        #     abort(
        #         400,
        #         description="An error occurred as the include taper provided is invalid",
        #     )
        # if not isinstance(blocked_days, list) \
        #     or (runs_per_week == "2-3" and len(blocked_days) > 4) \
        #     or (runs_per_week == "4-5" and len(blocked_days) > 2) \
        #     or (runs_per_week == "6+" and len(blocked_days) > 1) \
        #         :
        #     abort(
        #         400,
        #         description="An error occurred as the blocked days provided are invalid",
        #     )
    else:
        abort(
            400,
            description="An error occurred as not all compulsory plan details were provided",
        )

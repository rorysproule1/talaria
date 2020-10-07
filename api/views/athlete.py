from flask import Blueprint, Flask, request, Response
from database.models import Athlete

athlete = Blueprint("athlete", __name__)


@athlete.route("/athletes")
def get_athletes():
    athletes = Athlete.objects().to_json()
    return Response(athlete, mimetype="application/json", status=200)


@athlete.route("/athlete", methods=["POST"])
def post_athlete():
    body = request.get_json()
    athlete_id = body["athlete_id"]
    # If the athlete already exists, we update their access_token and expires_at, if not we create the new athlete instance
    Athlete.objects(athlete_id=athlete_id).update_one(**body, upsert=True)
    return {"athlete_id": str(athlete_id)}, 201


@athlete.route("/athlete/<athlete_id>", methods=["PUT"])
def update_athlete(athlete_id):
    body = request.get_json()
    Athlete.objects.get(athlete_id=athlete_id).update(**body)
    return "", 200


@athlete.route("/athlete/<athlete_id>", methods=["DELETE"])
def delete_athlete(athlete_id):
    Athlete.objects.get(athlete_id=athlete_id).delete()
    return "", 200


@athlete.route("/athlete/<athlete_id>")
def get_athlete(athlete_id):
    athlete = Athlete.objects.get(athlete_id=athlete_id).to_json()
    return Response(athlete, mimetype="application/json", status=200)
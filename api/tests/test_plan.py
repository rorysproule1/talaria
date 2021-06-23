import os
import tempfile
import datetime

import pytest

import flaskr


@pytest.fixture
def client():
    # Mock database
    db_fd, flaskr.app.config["DATABASE"] = tempfile.mkstemp()
    flaskr.app.config["TESTING"] = True

    with flaskr.app.test_client() as client:
        with flaskr.app.app_context():
            flaskr.init_db()
        yield client

    os.close(db_fd)
    os.unlink(flaskr.app.config["DATABASE"])


def test_get_all_plans_success(client):
    response = client.get(
        f"/athletes/{'6019870e9d42c77fe6d1c4da'}",
    )

    # Assert plans were returned
    assert response.status == 200 and len(response["data"] == 2)


def test_get_all_plans_no_exisiting_success(client):
    response = client.get(
        f"/athletes/{'5f897995b21b47794123b211'}",
    )

    # Assert plans were returned
    assert response.status == 200 and len(response["data"] == 0)


def test_get_all_plans_failure(client):
    response = client.get(
        f"/athletes/{'1'}",  # Invalid athleteID
    )

    # Assert user was created and both their plans exist
    assert response.status == 200 and len(response["data"] == 2)


def test_get_strava_insights_success(client):
    response = client.get(
        f"/strava-insights/{'6019870e9d42c77fe6d1c4da'}",
    )

    # Assert user was created and both their plans exist
    assert response.status == 200


def test_post_plan_success(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="5K",
            goal_type="DISTANCE",
            goal_time=None,
            runs_per_week="2-3",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=False,
        ),
    )

    assert response.status == 201


def test_post_plan_confidence_warning_success(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="MARATHON",
            goal_type="TIME",
            goal_time="02:00:00",
            runs_per_week="6+",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=False,
        ),
    )

    assert response.status == 200


def test_post_plan_force_success(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="MARATHON",
            goal_type="TIME",
            goal_time="02:00:00",
            runs_per_week="6+",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=True,
        ),
    )

    assert response.status == 201


def test_post_plan_invalid_distance_failure(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="8K",
            goal_type="TIME",
            goal_time="02:00:00",
            runs_per_week="6+",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=True,
        ),
    )

    assert response.status == 400


def test_post_plan_invalid_goal_failure(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="8K",
            goal_type="abc",
            goal_time="02:00:00",
            runs_per_week="6+",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=True,
        ),
    )

    assert response.status == 400


def test_post_plan_invalid_rpw_failure(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="10K",
            goal_type="abc",
            goal_time="02:00:00",
            runs_per_week="1-2",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=True,
        ),
    )

    assert response.status == 400


def test_post_plan_no_goal_time_in_time_plan_failure(client):
    response = client.post(
        "/plans",
        dict(
            athlete_id="6019870e9d42c77fe6d1c4da",
            distance="10K",
            goal_type="TIME",
            goal_time=None,
            runs_per_week="2-3",
            start_date=datetime.datetime.now() + datetime.timedelta(days=1),
            finish_date=datetime.datetime.now() + datetime.timedelta(months=3),
            long_run_day=None,
            blocked_days=[],
            name=None,
            include_cross_train=False,
            include_taper=False,
            force=True,
        ),
    )

    assert response.status == 400


def test_post_plan_no_data_failure(client):
    response = client.post(
        "/plans",
        dict(),
    )

    assert response.status == 400

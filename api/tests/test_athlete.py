import os
import tempfile
import datetime

import pytest
import flaskr


@pytest.fixture
def client():
    a=1
    # Mock database
    db_fd, flaskr.app.config["DATABASE"] = tempfile.mkstemp()
    flaskr.app.config["TESTING"] = True

    with flaskr.app.test_client() as client:
        with flaskr.app.app_context():
            flaskr.init_db()
        yield client

    os.close(db_fd)
    os.unlink(flaskr.app.config["DATABASE"])


def test_post_new_athlete_success(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            access_token="1a24bfeceebf300cfb881cb4524e108a0318fd8a",
            refresh_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=6),
        ),
    )

    # Assert user was created
    assert response.status == 201


def test_post_existing_athlete_success(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            access_token="1a24bfeceebf300cfb881cb4524e108a0318fd8a",
            refresh_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=6),
        ),
    )
    # Assert user was created
    assert response.status == 201

    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            access_token="1a24bfeceebf300cfb881cb4524e108a0318fd8a",
            refresh_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=6),
        ),
    )
    # Assert user was updated
    assert response.status == 200


def test_post_athlete_wrong_expiry_failure(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            access_token="1a24bfeceebf300cfb881cb4524e108a0318fd8a",
            refresh_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now()
            + datetime.timedelta(hours=-6),  # in past
        ),
    )

    assert response.status == 400


def test_post_athlete_wrong_access_token_failure(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            access_token="ghiuijo67890}'[]-[=-='",  # not alphanumeric
            refresh_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=-6),
        ),
    )

    assert response.status == 400


def test_post_athlete_wrong_refresh_token_failure(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id="51843824",  # not an int
            refresh_token="1a24bfeceebf300cfb881cb4524e108a0318fd8a",
            access_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=-6),
        ),
    )

    assert response.status == 400


def test_post_athlete_wrong_strava_id_failure(client):
    response = client.post(
        "/athletes",
        data=dict(
            strava_id=51843824,
            refresh_token="ghiuijo67890}'[]-[=-='",  # not alphanumeric
            access_token="ffe49125a7e3bd65b09d126da69105da1e6a9077",
            expires_at=datetime.datetime.now() + datetime.timedelta(hours=-6),
        ),
    )

    assert response.status == 400


def test_post_athlete_no_data_failure(client):
    response = client.post(
        "/athletes",
        data=dict(),
    )

    assert response.status == 400
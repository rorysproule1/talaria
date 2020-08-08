import time
import logging
import requests
from decouple import config
from flask import Flask, request
from extensions import register_extensions
from config import register_env_variables
from views.cars import cars
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import urls
import os

app = Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://postgres:password@localhost:5432/postgres"
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# Now we register any extensions we use into the app
# register_extensions(app)

# Register all blueprints for the app
app.register_blueprint(cars)

# Configure all env variables for the app
register_env_variables()


@app.route('/')
def index():
    return "This is an example app"

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

def get_access_token():
    payload = {
        'client_id': config('STRAVA_CLIENT_ID'),
        'client_secret': config('STRAVA_CLIENT_SECRET'),
        'refresh_token': config('STRAVA_REFRESH_TOKEN'),
        'grant_type': "refresh_token",
        'f': "json",
    }

    # post to strava api requesting a new access token (these expire every 6 hours)
    print('\nRequesting Access Token ...\n')
    response = requests.post(urls.STRAVA_AUTHORIZE_URL, data=payload, verify=False)

    if response.ok:
        access_token = response.json()['access_token']
        print(f"\nReceived Access Token - {access_token}\n")
        # set the env variable to the new access token for later use
        os.environ["STRAVA_ACCESS_TOKEN"] = access_token
    else:
        # output error message
        print('\nError when requesting Access Token ...\n')
        print(f"\n{response.raise_for_status()}\n")

    return {"access_token": access_token}


def check_for_new_access_token():
    """
    To reduce the number of polls to the strava api, we only request a new access token
    if there isn't currently one stored in the app
    """
    if not os.environ.get('STRAVA_ACCESS_TOKEN'):
        return get_access_token()["access_token"]
    else: 
        return config('STRAVA_ACCESS_TOKEN')

@app.route('/activities')
def get_activities():
    
    access_token = check_for_new_access_token()
    
    header = {'Authorization': f"Bearer {config('STRAVA_ACCESS_TOKEN')}"}
    params = {'per_page': 100, 'page': 1}
 
    # get all athlete activities from strava api
    print('\nRequesting athlete activities ...\n')
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    return {"activities": response.json()}


    
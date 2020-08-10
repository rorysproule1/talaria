import time
import logging
import requests
import urls
import os

from flask import Flask, Blueprint, request
from decouple import config

strava = Blueprint('strava', __name__)

@strava.route('/activities')
def get_activities():
    
    access_token = check_for_new_access_token()
    
    header = {'Authorization': f"Bearer {access_token}"}
    params = {'per_page': 100, 'page': 1}
 
    # get all athlete activities from strava api
    print('\nRequesting athlete activities ...\n')
    response = requests.get(urls.STRAVA_ACTIVITIES_URL, headers=header, params=params)

    return {"activities": response.json()}

@strava.route('/authorize')
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

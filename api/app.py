import time
import logging
import requests
from decouple import config
from flask import Flask, request
from extensions import register_extensions
from config import register_env_variables
from views.cars import cars
from views.strava import strava
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
app.register_blueprint(strava)

# Configure all env variables for the app
register_env_variables()


@app.route('/')
def index():
    return "This is an example app"

@app.route('/time')
def get_current_time():
    return {'time': time.time()}
    
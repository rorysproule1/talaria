import time
import logging
import requests
from decouple import config
from flask import Flask, request, Response
from extensions import register_extensions
from config import register_env_variables
from views.cars import cars
from views.strava import strava
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import urls
import os
import smtplib, ssl

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

@app.route('/test')
def test():
    return config('TALARIA_EMAIL')

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/email')
def send_email():
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"

    sender_email = str(config('TALARIA_EMAIL'))
    password = str(config('TALARIA_PASSWORD'))
    receiver_email = "stuartcollinson4@hotmail.com"
    
    message = """\
    Subject: Hi there

    This was sent wif python :D"""

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)

    return Response(status=200)
    
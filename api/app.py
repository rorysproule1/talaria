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
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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
    receiver_email = "rory.sproule@outlook.com"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Account created successfully!"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hi,
    How are you?
    Real Python has many great tutorials:
    www.realpython.com"""
    html = """\
    <html>
    <body>
        <p>Hi,<br>
        How are you?<br>
        <a href="http://www.realpython.com">Real Python</a> 
        has many great tutorials.
        </p>
    </body>
    </html>
    """

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

    return Response(status=200)
    
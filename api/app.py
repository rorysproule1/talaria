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
    email = request.args.get('email', 'not found')
    return email

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/email')
def send_email():
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"

    sender_email = str(config('TALARIA_EMAIL'))
    password = str(config('TALARIA_PASSWORD'))
    receiver_email = request.args.get('email')
    name = request.args.get('name')

    message = MIMEMultipart("alternative")
    message["Subject"] = "Account created successfully!"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = """\
    Hi there!
    Thank you for signing up to Talaria!
    We hope we can help you smash whatever goals you are aspiring for.
    So ... what are we waiting for?
    Let's get started - http://localhost:3000"""
    html = """\
    <html>
    <body>
        <p>Hi there {name}<br><br>
        Thank you for signing up to Talaria!<br><br>
        We hope we can help you smash whatever goals you are aspiring for.<br>
        So ... what are we waiting for?
        <a href="http://localhost:3000">Let's get started!</a> 
        </p>
        <p>
        Sincerely, the Talaria team.
        </p
    </body>
    </html>
    """.format(name=name)

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        print(f"Logging into notifications email account ...")
        server.login(sender_email, password)
        print(f"Sending email to {receiver_email} ...")
        server.sendmail(sender_email, receiver_email, message.as_string())
        print(f"Sent email to {receiver_email} ...")

    return Response(status=200)
    
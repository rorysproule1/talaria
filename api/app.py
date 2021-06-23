from decouple import config
from flask import Flask, request, Response
from extensions import register_extensions
from config import register_env_variables
from views.strava import strava
from views.athlete import athlete
from views.plan import plan

"""
This is the entry point to the backend of the application, it registers any extensions to the app
such as the db, registers the views for each class of endpoint and configures the env variables
""" 

app = Flask(__name__)

# Now we register any extensions we use into the app
register_extensions(app)

# Register all blueprints for the app
app.register_blueprint(strava)
app.register_blueprint(athlete)
app.register_blueprint(plan)

# Configure all env variables for the app
register_env_variables()

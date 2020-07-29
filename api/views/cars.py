import time
from flask import Flask, Blueprint

cars = Blueprint('cars', __name__)

@cars.route('/')
def index():
    return 'This is in the cars Blueprint'
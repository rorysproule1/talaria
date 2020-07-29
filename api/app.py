import time
from flask import Flask
from views.cars import cars

app = Flask(__name__)
app.register_blueprint(cars)


@app.route('/')
def index():
    return "This is an example app"

@app.route('/time')
def get_current_time():
    return {'time': time.time()}
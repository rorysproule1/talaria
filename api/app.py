import time
import logging
from flask import Flask, request
from extensions import register_extensions
from views.cars import cars
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://postgres:password@localhost:5432/postgres"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Now we register any extensions we use into the app
# register_extensions(app)

# Register all blueprints for the app
app.register_blueprint(cars)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    type = db.Column(db.String())
    age = db.Column(db.Integer())

    def __init__(self, name, type, age):
        self.name = name
        self.type = type
        self.age = age

    def __repr__(self):
        return f"<User {self.name}>"

@app.route('/users', methods=['POST', 'GET'])
def handle_users():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_user = User(name=data['name'], type=data['type'], age=data['age'])
            db.session.add(new_user)
            db.session.commit()
            return {"message": f"user {new_user.name} has been created successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        users = User.query.all()
        # results = [
        #     {
        #         "name": user.name,
        #         "type": user.type,
        #         "age": user.age
        #     } for car in cars]

        return users

@app.route('/')
def index():
    return "This is an example app"

@app.route('/time')
def get_current_time():
    return {'time': time.time()}



    
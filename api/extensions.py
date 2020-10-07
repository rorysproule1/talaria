from database.db import initialize_db


def register_extensions(app):
    """Adds any previously created extension objects into the app, and does any further setup they need."""

    app.config["MONGODB_SETTINGS"] = {"host": "mongodb://localhost/talaria"}
    initialize_db(app)

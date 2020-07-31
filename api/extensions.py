from flask_sqlalchemy import SQLAlchemy

# Create empty extension objects here
db = SQLAlchemy()


def register_extensions(app):
    """Adds any previously created extension objects into the app, and does any further setup they need."""
    db.init_app(app)

    # All done!
    app.logger.info("Extensions registered")

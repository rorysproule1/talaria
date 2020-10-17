from decouple import config

def register_env_variables():
    """Configures all used environment variables"""

    # Register Strava variables
    STRAVA_CLIENT_ID = config('STRAVA_CLIENT_ID')
    STRAVA_CLIENT_SECRET = config('STRAVA_CLIENT_SECRET')

    # Register email variables
    TALARIA_EMAIL = config('TALARIA_EMAIL')
    TALARIA_PASSWORD = config('TALARIA_PASSWORD')
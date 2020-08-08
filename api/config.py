from decouple import config

def register_env_variables():
    """Configures all used environment variables"""

    # Register Strava variables
    STRAVA_CLIENT_ID = config('STRAVA_CLIENT_ID')
    STRAVA_CLIENT_SECRET = config('STRAVA_CLIENT_SECRET')
    STRAVA_REFRESH_TOKEN = config('STRAVA_REFRESH_TOKEN')
    STRAVA_ACCESS_TOKEN = config('STRAVA_ACCESS_TOKEN')
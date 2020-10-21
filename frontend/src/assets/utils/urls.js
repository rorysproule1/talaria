/**
 * Central area to control key internal and external URLs
 */

// Strava URLs
export const StravaToken = "https://www.strava.com/oauth/token";
export const StravaAuthorization = `https://www.strava.com/oauth/authorize?client_id=52053&redirect_uri=http://localhost:3000/login&response_type=code&scope=activity:read_all`;

// Talaria URLs
export const CreatePlan = "/create-plan";
export const Login = "/login"
export const Dashboard = "/"

// API URLS
export const Athletes = "/athletes"
export const Plans = "/plans"
export const StravaInsights = "/strava-insights"
export const DashboardActivities = "/dashboard"



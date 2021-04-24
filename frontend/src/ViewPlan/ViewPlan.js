import React, { Component, useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../assets/js/Header";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Footer from "../assets/js/Footer";
import * as enums from "../assets/utils/enums";
import * as urls from "../assets/utils/urls";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import DialogActions from "@material-ui/core/DialogActions";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import CloseIcon from "@material-ui/icons/Close";

const localizer = momentLocalizer(moment);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
  },
  icon: {
    verticalAlign: "text-bottom",
    marginRight: theme.spacing(2),
    color: "orange",
  },
  warningColor: {
    backgroundColor: "rgb(255, 244, 229)",
  },
  breadcrumb: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  load: {
    margin: "auto",
    marginLeft: theme.spacing(18),
    marginBottom: theme.spacing(3),
  },
  error: {
    display: "flex",
    marginLeft: "auto",
    paddingRight: theme.spacing(2),
  },
  padding: {
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const now = new Date();
let eventsList = [];
let dateList = [];

export default function ViewPlan() {
  const classes = useStyles();
  const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

  const [plan, setPlan] = useState();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState();

  useEffect(() => {
    // get the extended details for this plan
    axios
      .get(
        urls.Plans +
          "/" +
          sessionStorage.athleteID +
          "/" +
          sessionStorage.planID
      )
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        setPlan(response.data);

      })
      .catch((error) => {
        console.log(error);
        setLoadingError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (plan) {
      // create Event objects for each activity
      plan.activities.forEach(createEvent);

      // create Event objects for the rest days
      var startDate = plan.activities[0]["date"];
      startDate = new Date(startDate);
      var finishDate = plan.activities[plan.activities.length - 1]["date"];
      finishDate = new Date(finishDate);
      var currentDate = startDate;
      while (currentDate < finishDate) {
        if (!dateList.includes(new Date(currentDate).toISOString())) {
          var title = "Rest Day";
          if (plan["cross_train"]) {
            title = "Rest or Cross Train";
          }
          eventsList.push({
            title: title,
            allDay: true,
            start: new Date(currentDate).toISOString(),
            end: new Date(currentDate).toISOString(),
            type: enums.EventType.REST,
          });
        }

        var newDate = currentDate.setDate(currentDate.getDate() + 1);
        currentDate = new Date(newDate);
      }
      setEvents(eventsList);
    }
  }, [plan]);

  function createEvent(activity, index) {
    const activityDate = new Date(activity.date).toISOString();
    dateList.push(activityDate);

    if (index === 0) {
      eventsList.push({
        title: "PLAN START",
        allDay: true,
        start: activityDate,
        end: activityDate,
        type: enums.EventType.MILESTONE,
      });
    } else if (index + 1 === plan.activities.length) {
      eventsList.push({
        title: "PLAN FINISH",
        allDay: true,
        start: activityDate,
        end: activityDate,
        type: enums.EventType.MILESTONE,
      });
    }

    var map_data = {};
    if (activity.completed) {
      map_data = {
        polyline: decode(activity.polyline),
        start_coord: activity.start_coord,
        end_coord: activity.end_coord,
      };
    }

    if (activity.distance) {
      eventsList.push({
        id: index + 1,
        title: capitalize(activity.run_type) + " Run",
        allDay: true,
        start: activityDate,
        end: activityDate,
        completed: activity.completed,
        missed: activity.missed,
        description: activity.description,
        time: activity.time,
        run_type: activity.run_type,
        map: map_data,
        type: enums.EventType.ACTIVITY,
        distance: activity.distance,
        pace: activity.average_pace,
        date_string: activity.date_string,
      });
    } else {
      eventsList.push({
        id: index + 1,
        title: capitalize(activity.run_type) + " Run",
        allDay: true,
        start: activityDate,
        end: activityDate,
        completed: activity.completed,
        missed: activity.missed,
        description: activity.description,
        time: activity.time,
        run_type: activity.run_type,
        map: map_data,
        type: enums.EventType.ACTIVITY,
        date_string: activity.date_string,
      });
    }
  }

  function capitalize(str) {
    if (str === "HALF-MARATHON") {
      return "Half-Marathon";
    } else if (str === "5K" || str === "10K") {
      return str;
    }
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }

  function Event({ event }) {
    if (event.type === enums.EventType.ACTIVITY) {
      return (
        <span>
          <strong>Activity {event.id}: </strong> {event.title}
        </span>
      );
    } else {
      return (
        <span>
          <strong>{event.title}</strong>
        </span>
      );
    }
  }

  const customDayPropGetter = (date) => {
    const calDate = date.setHours(0, 0, 0, 0);
    const nowDate = now.setHours(0, 0, 0, 0);

    if (calDate == nowDate)
      return {
        className: "special-day",
        style: {
          border: "solid 2px #f50057",
        },
      };
    else return {};
  };

  function eventStyleGetter(event) {
    var backgroundColor = "#8884D8";
    if (event.type === enums.EventType.MILESTONE) {
      backgroundColor = "#f5568d";
    } else if (event.type === enums.EventType.REST) {
      backgroundColor = "#ffffff";
    } else {
      // change color of event dependant on if its completion status
      if (event.missed == true) {
        backgroundColor = "#f26666";
      } else if (event.completed) {
        backgroundColor = "#afa";
      }
    }

    var style = {
      backgroundColor: backgroundColor,
      borderColor: "black",
      color: "black",
      border: "1px solid black",
    };
    return {
      style: style,
    };
  }

  const onErrorHandler = () => {
    window.location.href = "/";
  };

  const onCancelHandler = () => {
    setShowDeleteModal(false);
  };

  const onDeleteHandler = () => {
    axios
      .delete(urls.Plans + "/" + sessionStorage.planID)
      .then((response) => {
        setDeleteStatus("DELETED");
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
        setDeleteStatus("ERROR");
        setShowDeleteModal(false);
      });
  };

  const onActivityCloseHandler = () => {
    setSelectedActivity();
  };

  function onEventSelectHandler(event) {
    if (
      event.type !== enums.EventType.MILESTONE &&
      event.type !== enums.EventType.REST
    ) {
      setSelectedActivity(event);
    }
  }

  return (
    <React.Fragment>
      <Header connectToStrava={false} />
      <Breadcrumbs
        className={classes.breadcrumb}
        style={{ fontSize: 14 }}
        separator="-"
      >
        <LinkRouter
          color="inherit"
          onClick={(e) => sessionStorage.removeItem("planID")}
          to={{
            pathname: urls.Dashboard,
            state: { athleteID: sessionStorage.athleteID },
          }}
        >
          Home
        </LinkRouter>
        <Typography color="textPrimary" style={{ fontSize: 14 }}>
          View Plan
        </Typography>
      </Breadcrumbs>
      <div style={{ height: "500pt", margin: "50px" }}>
        {deleteStatus === "DELETED" && (
          <Alert severity="error" className={classes.padding}>
            This plan has been deleted. Click{" "}
            <LinkRouter
              to={{
                pathname: urls.Dashboard,
              }}
            >
              here
            </LinkRouter>{" "}
            to return to your Dashboard.
          </Alert>
        )}
        {plan && plan.status === "COMPLETED" && (
          <Alert severity="success" className={classes.padding}>
            Congratulations! You managed to complete this plan successfully.
          </Alert>
        )}
        {plan && plan.status === "FAILED" && (
          <Alert severity="error" className={classes.padding}>
            Unfortunately you didn't manage to complete this plan.
          </Alert>
        )}
        {deleteStatus === "ERROR" && (
          <Alert severity="error" className={classes.padding}>
            ERROR: There was a problem when deleting your plan
          </Alert>
        )}
        {plan && (
          <Card className={classes.padding} variant="outlined">
            <CardHeader
              action={
                deleteStatus !== "DELETED" && (
                  <IconButton
                    aria-label="delete-plan"
                    onClick={(e) => setShowDeleteModal(true)}
                  >
                    <DeleteOutlinedIcon color="secondary" />
                  </IconButton>
                )
              }
              title={plan && plan.name && plan.name}
              titleTypographyProps={{ variant: "h3" }}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Distance"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {capitalize(plan.distance)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Goal"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {capitalize(plan.goal_type)}
                          {plan.goal_type === enums.GoalType.TIME && (
                            <Typography
                              variant="subtitle1"
                              component="subtitle1"
                              align="center"
                            >
                              {" "}
                              ({plan.goal_time})
                            </Typography>
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Runs Per Week"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {plan.runs_per_week}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Finish Date"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {plan.finish_date &&
                            plan.finish_date.substring(
                              0,
                              plan.finish_date.length - 12
                            )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Blocked Days"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        {plan.blocked_days.length === 0 && (
                          <Typography
                            variant="h6"
                            component="h6"
                            align="center"
                          >
                            N/A
                          </Typography>
                        )}
                        {plan.blocked_days.length === 1 && (
                          <Typography
                            variant="h6"
                            component="h6"
                            align="center"
                          >
                            {plan.blocked_days}
                          </Typography>
                        )}
                        {plan.blocked_days.length > 1 && (
                          <Typography
                            variant="h6"
                            component="h6"
                            align="center"
                          >
                            {plan.blocked_days.join(", ")}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Includes Taper"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {plan.include_taper ? "Yes" : "No"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Includes Cross Training"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h6" align="center">
                          {plan.include_cross_train ? "Yes" : "No"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  {(plan.distance === enums.Distance.HALF_MARATHON ||
                    plan.distance === enums.Distance.MARATHON) && (
                    <Grid item xs={3}>
                      <Card className={classes.paper} variant="outlined">
                        <CardHeader
                          title="Long Run Day"
                          titleTypographyProps={{ variant: "overline" }}
                          style={{ paddingBottom: "0px" }}
                        />
                        <CardContent>
                          <Typography
                            variant="h6"
                            component="h6"
                            align="center"
                          >
                            {plan.long_run_day ? plan.long_run_day : "N/A"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Calendar
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          views={["month", "week"]}
          onSelectEvent={(event) => onEventSelectHandler(event)}
          dayPropGetter={customDayPropGetter}
          eventPropGetter={eventStyleGetter}
          components={{
            event: Event,
          }}
          style={{ paddingBottom: "10px" }}
        />
      </div>

      {/* <Footer /> */}

      {/* Dialog box for activity */}
      {selectedActivity && (
        <Dialog
          open={selectedActivity}
          TransitionComponent={Transition}
          keepMounted
          onClose={onActivityCloseHandler}
        >
          <DialogTitle>
            <strong>Training Run {selectedActivity.id}</strong>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onActivityCloseHandler}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedActivity.missed && (
              <Alert severity="error" className={classes.padding}>
                You missed this activity. Try to keep up with your training plan
                to give yourself the best chance of completing it!
              </Alert>
            )}
            {selectedActivity.completed && (
              <Alert severity="success" className={classes.padding}>
                Well done! You completed this activity!
              </Alert>
            )}
            {!selectedActivity.missed && !selectedActivity.completed && (
              <Alert severity="info" className={classes.padding}>
                Due to this training plan being generated based off your real
                life Strava runs, some of the details about this activity may
                change before the day it is due to take place.
              </Alert>
            )}
            <div className={classes.padding}>
              <strong>Date:</strong>{" "}
              {selectedActivity.date_string.substring(
                0,
                selectedActivity.date_string.length - 12
              )}
              <br></br>
              <strong>Type:</strong> {capitalize(selectedActivity.run_type)} Run
              <br></br>
              <strong>Time:</strong> {selectedActivity.time} mins<br></br>
              {selectedActivity.distance && (
                <>
                  <strong>Estimated Distance:</strong>{" "}
                  {selectedActivity.distance}KM<br></br>
                  <strong>Estimated Pace:</strong> {selectedActivity.pace} /KM{" "}
                  <br></br>
                </>
              )}
              <strong>Description:</strong> {selectedActivity.description}
            </div>
            {selectedActivity.completed && (
              <div style={{ textAlign: "-webkit-center" }}>
                <Typography variant="h6" component="h6" align="center">
                  Run Map
                </Typography>
                <MapContainer
                  center={selectedActivity.map.start_coord}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={selectedActivity.map.polyline}
                    color="purple"
                  />
                  <Marker
                    position={selectedActivity.map.start_coord}
                    title="Start"
                  />
                  <Marker
                    position={selectedActivity.map.end_coord}
                    title="End"
                  />
                </MapContainer>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <br />
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog box for plan loading */}
      {loading && (
        <Dialog open={loading} TransitionComponent={Transition} keepMounted>
          <DialogTitle>
            <strong>Gathering your plan information ...</strong>
          </DialogTitle>
          <DialogContent>
            <CircularProgress className={classes.load} />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog box for plan loading error */}
      {loadingError && (
        <Dialog
          open={loadingError}
          TransitionComponent={Transition}
          keepMounted
        >
          <DialogTitle>
            <strong>
              There was an error gathering your Strava run history.
            </strong>
          </DialogTitle>
          <DialogContent>
            <LinkRouter
              to={{
                pathname: urls.Dashboard,
              }}
            >
              <Button
                color="secondary"
                className={classes.error}
                onClick={onErrorHandler}
              >
                Return to Dashboard
              </Button>
            </LinkRouter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog box for plan deletion */}
      {showDeleteModal && (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          TransitionComponent={Transition}
          open={showDeleteModal}
        >
          <DialogTitle className={classes.warningColor}>
              <WarningRoundedIcon className={classes.icon} />
              Are you sure you would like to delete this plan?
          </DialogTitle>
          <DialogActions className={classes.warningColor}>
            <Button autoFocus onClick={onCancelHandler} color="secondary">
              No
            </Button>
            <Button onClick={onDeleteHandler} color="secondary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

// source: http://doublespringlabs.blogspot.com.br/2012/11/decoding-polylines-from-google-maps.html
// decode function to convert encoded polyline from Strava API to latlong pairs to output route of activity
function decode(encoded) {
  // array that holds the points
  var points = [];
  var index = 0,
    len = encoded.length;
  var lat = 0,
    lng = 0;
  while (index < len) {
    var b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63; //finds ascii                                                                                    //and substract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

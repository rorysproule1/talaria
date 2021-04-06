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
    // textAlign: "center",
    // color: theme.palette.text.secondary,
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
let activityEvents = [];

export default function ViewPlan() {
  const classes = useStyles();
  const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

  const [plan, setPlan] = useState();
  const [actEvents, setActivityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState();

  // get plan data
  useEffect(() => {
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

  // for each activity of the plan, create an event object to be displayed
  useEffect(() => {
    console.log(plan);
    if (plan) {
      plan.activities.forEach(createEvent);
    }
  }, [plan]);

  function createEvent(item, index) {
    const activityDate = new Date(item.date).toISOString();

    if (index === 0) {
      activityEvents.push({
        title: "Plan Start",
        allDay: true,
        start: activityDate,
        end: activityDate,
        milestone: true,
      });
    } else if (index + 1 === plan.activities.length) {
      activityEvents.push({
        title: "Plan Finish",
        allDay: true,
        start: activityDate,
        end: activityDate,
        milestone: true,
      });
    }

    activityEvents.push({
      id: index + 1,
      title: capitalize(item.run_type) + " Run",
      allDay: true,
      start: activityDate,
      end: activityDate,
      completed: item.completed,
      missed: item.missed,
      description: item.description,
      time: item.time,
      run_type: item.run_type,
      polyline: decode(item.polyline),
      start_coord: item.start_coord,
      end_coord: item.end_coord,
      milestone: false,
    });

    setActivityEvents(activityEvents);
  }

  function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
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
    if (event.milestone) {
      backgroundColor = "#f5568d";
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

  const onErrorClick = () => {
    window.location.href = "/";
  };

  function Event({ event }) {
    if (!event.milestone) {
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

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
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

  const handleActivityClose = () => {
    setSelectedActivity();
  };

  function onEventSelect(event) {
    if (!event.milestone) {
      setSelectedActivity(event)
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
        {deleteStatus === "ERROR" && (
          <Alert severity="error" className={classes.padding}>
            ERROR: There was a problem when deleting your plan
          </Alert>
        )}
        {plan && (
          <Card className={classes.padding} variant="outlined">
            <CardHeader
              action={
                <IconButton
                  aria-label="delete-plan"
                  onClick={(e) => setShowDeleteModal(true)}
                >
                  <DeleteOutlinedIcon color="secondary" />
                </IconButton>
              }
              title={plan && plan.name && plan.name}
              titleTypographyProps={{ variant: "h3" }}
              // subheader="September 14, 2016"
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Distance"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h4" component="h4" align="center">
                          {capitalize(plan.distance)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Goal"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h4" component="h4" align="center">
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
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Runs Per Week"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h4" component="h4" align="center">
                          {plan.runs_per_week}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Key Dates"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h5" align="center">
                          Start:{" "}
                          {plan.start_date
                            .toString()
                            .substring(
                              0,
                              plan.start_date.toString().indexOf("T")
                            )}
                          <br></br>
                          Finish:{" "}
                          {plan.finish_date &&
                            plan.finish_date
                              .toString()
                              .substring(
                                0,
                                plan.finish_date.toString().indexOf("T")
                              )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Blocked Days"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        {plan.blocked_days.length === 0 && (
                          <Typography
                            variant="h4"
                            component="h4"
                            align="center"
                          >
                            None
                          </Typography>
                        )}
                        {plan.blocked_days.length === 1 && (
                          <Typography
                            variant="h4"
                            component="h4"
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
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Includes Taper"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h4" component="h4" align="center">
                          {plan.include_taper ? "Yes" : "No"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={4}>
                    <Card className={classes.paper} variant="outlined">
                      <CardHeader
                        title="Includes Cross Training"
                        titleTypographyProps={{ variant: "overline" }}
                        style={{ paddingBottom: "0px" }}
                      />
                      <CardContent>
                        <Typography variant="h4" component="h4" align="center">
                          {plan.include_cross_train ? "Yes" : "No"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  {plan.distance === enums.Distance.HALF_MARATHON ||
                    (plan.distance === enums.Distance.MARATHON && (
                      <Grid item xs={4}>
                        <Card className={classes.paper} variant="outlined">
                          <CardHeader
                            title="Long Run Day"
                            titleTypographyProps={{ variant: "overline" }}
                            style={{ paddingBottom: "0px" }}
                          />
                          <CardContent>
                            <Typography
                              variant="h4"
                              component="h4"
                              align="center"
                            >
                              {plan.long_run_day}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Calendar
          events={actEvents}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          views={["month", "week"]}
          onSelectEvent={(event) => onEventSelect(event)}
          dayPropGetter={customDayPropGetter}
          eventPropGetter={eventStyleGetter}
          components={{
            event: Event,
          }}
        />
      </div>

      {/* <Footer /> */}

      {/* Dialog box for activity */}
      {selectedActivity && (
        <Dialog
          open={selectedActivity}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleActivityClose}
        >
          <DialogTitle>
            <strong>Training Run {selectedActivity.id}</strong>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleActivityClose}
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
                This is an upcoming event.
              </Alert>
            )}
            <div className={classes.padding}>
              <strong>Date:</strong>{" "}
              {selectedActivity.start
                .toString()
                .substring(0, selectedActivity.start.indexOf("T"))}
              <br></br>
              <strong>Type:</strong> {capitalize(selectedActivity.run_type)} Run
              <br></br>
              <strong>Time:</strong> {selectedActivity.time} mins<br></br>
              <strong>Description:</strong> {selectedActivity.description}
            </div>

            <MapContainer
              center={selectedActivity.start_coord}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline positions={selectedActivity.polyline} color="purple" />
              <Marker position={selectedActivity.start_coord} title="Start" />
              <Marker position={selectedActivity.end_coord} title="End" />
            </MapContainer>
          </DialogContent>
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
                onClick={onErrorClick}
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
            <strong>
              <WarningRoundedIcon className={classes.icon} />
              Are you sure you would like to delete this plan?
            </strong>
          </DialogTitle>
          <DialogActions className={classes.warningColor}>
            <Button autoFocus onClick={handleCancel} color="primary">
              No
            </Button>
            <Button onClick={handleDelete} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

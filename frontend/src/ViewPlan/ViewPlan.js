import React, { Component, useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../assets/js/Header";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Footer from "../assets/js/Footer";
import * as urls from "../assets/utils/urls";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));

const now = new Date();
const events = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2019, 6, 0),
    end: new Date(2019, 6, 1),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2019, 3, 7),
    end: new Date(2019, 3, 10),
  },
  {
    id: 2,
    title: "Right now Time Event",
    start: now,
    end: now,
  },
];

// class EventComponent extends React.Component {
//   render() {
//     return <h1>here we go!</h1>
//   }
// }

export default function ViewPlan() {
  const classes = useStyles();
  const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

  useEffect(() => {
    /*
     On entry to CreatePlan, we get our list of strava insights to be used throughout plan creation to
     provide personalised suggestions
    */
    axios
      .get(urls.Plan + "/" + sessionStorage.planID )
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      <div style={{ height: "500pt", margin: "20px" }}>
        <Calendar
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          views={["month", "week"]}
          // popup={true}
          // components={{
          //   event: EventComponent
          // }}
        />
      </div>
      <Footer />
    </React.Fragment>
  );
}

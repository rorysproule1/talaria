import React, { Component } from "react";
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

export default function ViewPlan() {
  const classes = useStyles();
  const LinkRouter = (props) => <Link {...props} component={RouterLink} />;
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
      <div style={{ height: "500pt", marginTop: "10px" }}>
        <Calendar
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          views={["month", "week"]}
        />
      </div>
    </React.Fragment>
  );
}

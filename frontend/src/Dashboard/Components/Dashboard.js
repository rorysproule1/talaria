import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LastWeek from "./LastWeek";
import RecentRun from "./RecentRun";
import Plans from "./Plans";
import Header from "../../assets/js/Header";
import Footer from "../../assets/js/Footer";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as urls from "../../assets/utils/urls";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { DashboardContext } from "../DashboardContext";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  fab: {
    position: "fixed",
    top: "auto",
    left: "auto",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    margin: 0,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  layout: {
    width: "auto",
  },
}));

export default function Dashboard({ athleteID }) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [state, setState] = useContext(DashboardContext);
  const [plans, setPlans] = useState(null);
  const [dashboardStrava, setDashboardStrava] = useState({
    latestRun: null,
    lastWeek: null,
  });
  const [createPlan, setCreatePlan] = useState(false);
  const [dashboardStravaError, setDashboardStravaError] = useState(false);
  const [dashboardPlansError, setDashboardPlansError] = useState(false);

  useEffect(() => {
    // On initial loading of the Dashboard, we request the user's plans and an insight into their recent Strava activity
    axios
      .get(`${urls.Plans}/${athleteID}`, {})
      .then((response) => {
        setPlans(response.data["plans"]);
      })
      .catch((error) => {
        setDashboardPlansError(true);
        console.log(error);
      });

    axios
      .get(urls.DashboardActivities, { params: { athlete_id: athleteID } })
      .then((response) => {
        setDashboardStrava({
          ...dashboardStrava,
          latestRun: response.data["latest_run"],
          lastWeek: response.data["last_week"],
        });
        console.log(response.data);
      })
      .catch((error) => {
        setDashboardStravaError(true);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setState({
      ...state,
      recentRun: dashboardStrava.latestRun,
      lastWeek: dashboardStrava.lastWeek,
    });
  }, [dashboardStrava]);

  useEffect(() => {
    setState({ ...state, plans: plans });
  }, [plans]);

  useEffect(() => {
    setState({ ...state, dashboardError: dashboardStravaError });
  }, [dashboardStravaError]);

  useEffect(() => {
    setState({ ...state, plansError: dashboardPlansError });
  }, [dashboardPlansError]);

  return (
    <React.Fragment>
      {createPlan && (
        <Redirect
          to={{
            pathname: urls.CreatePlan,
            state: { athleteID: athleteID },
          }}
        />
      )}
      <Header connectToStrava={false} />
      <CssBaseline />
      <main className={classes.layout}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Last Week Activity */}
            <Grid item xs={12} md={8} lg={7}>
              <Paper className={fixedHeightPaper}>
                <LastWeek />
              </Paper>
            </Grid>
            {/* Recent Run */}
            <Grid item xs={12} md={8} lg={5}>
              <Paper className={fixedHeightPaper}>
                <RecentRun />
              </Paper>
            </Grid>
            {/* Athlete's Plans */}
            <Plans />
          </Grid>
          <Fab
            aria-label="Create"
            className={classes.fab}
            color="primary"
            onClick={(e) => setCreatePlan(true)}
          >
            <AddIcon />
          </Fab>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}

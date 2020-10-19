import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import Header from "../../assets/js/Header";
import Footer from "../../assets/js/Footer";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as urls from "../../assets/utils/urls";
import { Redirect } from "react-router-dom";
import axios from "axios";

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
  content: {
    flexGrow: 1,
    height: "100vh",
  },
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
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const athleteID = props.location.state.athleteID;
  const [createPlan, setCreatePlan] = useState(false);

  useEffect(() => {

    axios
      .get(`${urls.Plans}/${athleteID}`, {})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    
      axios
      .get(urls.DashboardActivities, { params: { athlete_id: athleteID } })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      <div className={classes.root}>
        <CssBaseline />
        <main className={classes.content}>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Orders />
                </Paper>
              </Grid>
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
      </div>
      <Footer />
    </React.Fragment>
  );
}

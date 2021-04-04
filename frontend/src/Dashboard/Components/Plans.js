import React, { useContext, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Title from "./Title";
import { DashboardContext } from "../DashboardContext";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as enums from "../../assets/utils/enums";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as urls from "../../assets/utils/urls";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  loading: {
    margin: "0 auto",
    marginTop: theme.spacing(5),
  },
  error: {
    whiteSpace: "initial",
  },
  divider: {
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Plans() {
  // This component provides the runner with their existing training plans, which are requested in Dashboard.js

  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      {state.dashboardError ? (
        <Typography component="p" color="textSecondary">
          There was an error getting your training plans
        </Typography>
      ) : state.plans ? (
        <>
          <Typography component="p" variant="h5" className={classes.divider}>
            Training Plans
          </Typography>
          {state.plans.map((plan) => (
            <Grid key={plan._id} item xs={12}>
              <Paper className={classes.paper}>
                <Title>{plan.name}</Title>
                <Typography component="p" variant="h4">
                  {plan.distance}
                </Typography>
                <Typography color="textSecondary">
                  Goal:{" "}
                  {plan.goal_type === enums.GoalType.DISTANCE
                    ? "Run the distance"
                    : `Run the distance in sub ${plan.goal_time}`}
                </Typography>
                <Typography color="textSecondary">
                  {plan.runs_per_week} runs per week
                </Typography>

                <div className={classes.seeMore}>
                  <Link color="primary" href="/view-plan">
                    View Plan
                  </Link>
                </div>
              </Paper>
            </Grid>
          ))}
        </>
      ) : (
        <CircularProgress color="secondary" className={classes.loading} />
      )}
    </React.Fragment>
  );
}

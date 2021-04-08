import React, { useContext, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Title from "./Title";
import { DashboardContext } from "../DashboardContext";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as enums from "../../assets/utils/enums";
import * as urls from "../../assets/utils/urls";

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
  noPlans: {
    textAlign: "center"
  }
}));

export default function Plans() {
  // This component provides the runner with their existing training plans, which are requested in Dashboard.js

  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      <Typography component="p" variant="h5" className={classes.divider}>
        Training Plans
      </Typography>
      {state.dashboardError && (
        <Typography component="p" color="textSecondary">
          There was an error getting your training plans
        </Typography>
      )}
      {state.plans && (
        <>
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
                  <Link
                    color="primary"
                    href="/view-plan"
                    onClick={(e) => sessionStorage.setItem("planID", plan._id)}
                  >
                    View Plan
                  </Link>
                </div>
              </Paper>
            </Grid>
          ))}
        </>
      )}
      {state.plans.length === 0 && (
        <Grid key={1} item xs={12}>
          <Typography className={classes.noPlans} color="textSecondary">
            Sorry! You don't seem to have any plans created. Click{" "}<Link href={urls.CreatePlan}>
            here
          </Link>{" "}to get started.
          </Typography>
        </Grid>
      )}
    </React.Fragment>
  );
}

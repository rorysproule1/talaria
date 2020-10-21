import React, { useContext } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Title from "./Title";
import { DashboardContext } from "../DashboardContext";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as enums from "../../assets/utils/enums";
import CircularProgress from "@material-ui/core/CircularProgress";

function preventDefault(event) {
  event.preventDefault();
}

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
}));

export default function Plans() {
  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      {state.plans ? (
        <>
          {state.plans.map((plan) => (
            <Grid key={plan._id} item xs={12}>
              <Paper className={classes.paper}>
                <Title>{plan.name}</Title>
                <Typography component="p" variant="h4">
                  {plan.distance}
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.depositContext}
                >
                  Goal:{" "}
                  {plan.goal_type === enums.GoalType.DISTANCE
                    ? "Run the distance"
                    : `Run the distance in sub ${plan.goal_time}`}
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.depositContext}
                >
                  {plan.runs_per_week} runs per week
                </Typography>

                <div className={classes.seeMore}>
                  <Link color="primary" href="#" onClick={preventDefault}>
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

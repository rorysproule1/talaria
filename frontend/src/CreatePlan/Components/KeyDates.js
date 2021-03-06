import React, { useState, useContext, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import DatePicker from "react-date-picker";
import Alert from "@material-ui/lab/Alert";
import { CreatePlanContext } from "../CreatePlanContext";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "16px",
    marginTop: theme.spacing(1),
  },
  date: {
    marginLeft: theme.spacing(1),
  },
  info: {
    marginTop: theme.spacing(2),
  },
}));

export default function KeyDatesForm() {
  // This is the third form in the CreatePlan flow, it allows the user to optionally select a finish date for their plan
  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);
  const [planDuration, setPlanDuration] = useState();

  useEffect(() => {
    // on loading, set the default startDate to tomorrow
    setState({ ...state, startDate: addDays(new Date(), 1) });
  }, []);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function onStartChangeHandler(date) {
    setState({ ...state, startDate: date });

    if (date && state.finishDate) {
      getPlanDuration(state.finishDate);
    } else {
      setPlanDuration(null);
    }
  }

  function onFinishChangeHandler(date) {
    setState({ ...state, finishDate: date });

    if (date) {
      getPlanDuration(date);
    } else {
      setPlanDuration(null);
    }
  }

  function getPlanDuration(date) {
    // Calculation of the amount of days/weeks between the current date of plan creation and the desired finish date
    var diffInMs = date - addDays(new Date(), 1);
    if (state.startDate) {
      diffInMs = date - state.startDate;
    }
    var diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    var planString = "";

    if (diffInDays < 1) {
      diffInDays = 1;
    } else {
      diffInDays = Math.ceil(diffInDays);
    }

    if (diffInDays < 7) {
      planString =
        "This gives you " + diffInDays + " day(s) to complete the plan";
    } else {
      const weeks = Math.floor(diffInDays / 7);
      const days = diffInDays % 7;
      if (days !== 0) {
        planString =
          "This gives you " +
          weeks +
          " week(s) and " +
          days +
          " day(s) to complete the plan";
      } else {
        planString =
          "This gives you " + weeks + " week(s) to complete the plan";
      }
    }

    setPlanDuration(planString);
  }

  return (
    <React.Fragment>
      <Alert severity="warning" className={classes.title}>
        {" "}
        IMPORTANT: If you aren't creating this training plan with a race date or
        event date in mind, please click 'Next' and allow us to generate a plan
        with an appropriate finish date for your running level. This will give
        you the best chance to achieve your goal without burning out or stopping
        due to injury. Trust us!
      </Alert>

      <Grid item xs={12} sm={8} md={6}>
        Plan Start Date:
        <DatePicker
          onChange={onStartChangeHandler}
          minDate={addDays(new Date(), 1)}
          value={state.startDate}
          className={classes.date}
          clearIcon={null}
        />
      </Grid>

      <Grid item xs={12} sm={8} md={6}>
        Plan Finish Date:
        <DatePicker
          onChange={onFinishChangeHandler}
          minDate={addDays(state.startDate, 42)}
          value={state.finishDate}
          className={classes.date}
        />
        {planDuration && (
          <Alert severity="info" className={classes.info}>
            {planDuration}
          </Alert>
        )}
      </Grid>
    </React.Fragment>
  );
}

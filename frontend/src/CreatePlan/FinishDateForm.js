import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import DatePicker from "react-date-picker";
import Alert from "@material-ui/lab/Alert";

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

export default function GoalTypeForm({ access_token }) {
  const classes = useStyles();
  
  const [endDate, setEndDate] = useState();
  const [planDuration, setPlanDuration] = useState();

  function onChangeHandler(e) {
    setEndDate(e);

    if (e) {
      getPlanDuration(e);
    } else {
      setPlanDuration(null);
    }
  }

  function getPlanDuration(date) {
    var diffInMs = date - new Date();
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
      if (days != 0) {
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
        IMPORTANT: If you aren't creating this training plan with a race or
        event date in mind, please click 'Next' and allow us to generate a plan
        of an appropriate length of time for your current running level. This
        will give you the best chance to achieve your goal without burning out
        or stopping due to injury. Trust us!
      </Alert>

      <Grid item xs={16} sm={8} md={6}>
        Plan Completion Date:
        <DatePicker
          onChange={onChangeHandler}
          minDate={new Date()}
          value={endDate}
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

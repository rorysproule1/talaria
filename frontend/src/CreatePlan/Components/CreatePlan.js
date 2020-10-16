import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Distance from "./Distance";
import GoalType from "./GoalType";
import FinishDate from "./FinishDate";
import RunsPerWeek from "./RunsPerWeek";
import Preferences from "./Preferences";
import Summary from "./Summary.js";
import Header from "../../assets/js/Header";
import Footer from "../../assets/js/Footer";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { CreatePlanContext } from "../CreatePlanContext";
import axios from "axios";
import * as urls from "../../assets/utils/urls";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 2),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  cardGrid: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

const steps = [
  "Distance",
  "Goal Type",
  "Finish Date",
  "Runs Per Week",
  "Preferences",
  "Summary",
];

export default function CreatePlan({ athleteID }) {
  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);

  useEffect(() => {
    /*
     On entry to CreatePlan, we get our list of strava insights to be used throughout plan creation to
     provide personalised suggestions
    */
    axios
      .get(urls.StravaInsights, { params: { athlete_id: athleteID } })
      .then((response) => {
        // assign to context state values
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = () => {
    setState({ ...state, planSubmitted: true });

    // TODO: post plan details to API
  };

  const handleNext = () => {
    if (state.step === 3 && !state.runsPerWeek) {
      // Check if a value for RunsPerWeek has been provided on this form, if not an error is presented
      setState({ ...state, runsPerWeekError: true });
    } else {
      setState({ ...state, step: state.step + 1, runsPerWeekError: false });
    }
  };

  const handleBack = () => {
    setState({ ...state, step: state.step - 1 });
  };

  useEffect(() => {
    // scroll to top of the screen on movement to next step
    const body = document.querySelector("#root");
    body.scrollIntoView();
  }, [state.step]);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Distance />;
      case 1:
        return <GoalType />;
      case 2:
        return <FinishDate />;
      case 3:
        return <RunsPerWeek />;
      case 4:
        return <Preferences />;
      case 5:
        return <Summary />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <React.Fragment>
      <Header connectToStrava={false} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create Training Plan
          </Typography>
          <Stepper activeStep={state.step} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Grid container spacing={3}>
            <Container className={classes.cardGrid} maxWidth="md">
              <Grid container spacing={4}>
                {getStepContent(state.step)}
              </Grid>
            </Container>
          </Grid>
          <div className={classes.buttons}>
            {state.step !== 0 && (
              <Button onClick={handleBack} className={classes.button}>
                Back
              </Button>
            )}
            {state.step !== 0 && state.step !== 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={state.step === 5 ? handleSubmit : handleNext}
                className={classes.button}
              >
                {state.step === steps.length - 1 ? "Create Plan" : "Next"}
              </Button>
            )}
          </div>
        </Paper>
      </main>
      <Footer />
    </React.Fragment>
  );
}

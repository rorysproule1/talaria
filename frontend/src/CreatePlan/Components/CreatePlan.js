import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DistanceForm from "./DistanceForm";
import GoalTypeForm from "./GoalTypeForm";
import FinishDateForm from "./FinishDateForm";
import RunsPerWeekForm from "./RunsPerWeekForm";
import PreferencesForm from "./PreferencesForm";
import Summary from "./Summary.js";
import Header from "../../assets/js/Header";
import Footer from "../../assets/js/Footer";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { CreatePlanContext } from "../CreatePlanContext";

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

export default function CreatePlan() {
  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);

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
        return <DistanceForm />;
      case 1:
        return <GoalTypeForm />;
      case 2:
        return <FinishDateForm />;
      case 3:
        return <RunsPerWeekForm />;
      case 4:
        return <PreferencesForm />;
      case 5:
        return <Summary />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <React.Fragment>
      <Header connect_to_strava={false} />
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
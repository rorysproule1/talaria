import React, { useState, useEffect } from "react";
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
import Review from "./Review.js";
import Header from "../assets/js/Header";
import Footer from "../assets/js/Footer";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
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

export default function CreatePlan(props) {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(3);
  const [accessToken, setAccessToken] = useState(
    props.location.state.accessToken
  );

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <DistanceForm access_token={accessToken} />;
      case 1:
        return <GoalTypeForm />;
      case 2:
        return <FinishDateForm />;
      case 3:
        return <RunsPerWeekForm />;
      case 4:
        return <Review />;
      case 5:
        return <Review />;
      case 6:
        return <Review />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <React.Fragment>
      <Header connect_to_strava={false}/>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create Training Plan
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid container spacing={3}>
                  <Container className={classes.cardGrid} maxWidth="md">
                      <Grid container spacing={4}>
                        {getStepContent(activeStep)}
                      </Grid>
                  </Container>
                </Grid>
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  {activeStep !== steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? "Place order" : "Next"}
                    </Button>
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
      <Footer />
    </React.Fragment>
  );
}

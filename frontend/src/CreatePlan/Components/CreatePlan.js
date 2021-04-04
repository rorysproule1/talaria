import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Distance from "./Distance";
import GoalType from "./GoalType";
import FinishDate from "./KeyDates";
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
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

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
  breadcrumb: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  load: {
    margin: "auto",
    marginLeft: theme.spacing(18),
    marginBottom: theme.spacing(3),
  },
  error: {
    display: "flex",
    marginLeft: "auto",
    paddingRight: theme.spacing(2),
  },
  icon: {
    verticalAlign: "text-bottom",
    marginRight: theme.spacing(2),
    color: "orange",
  },
  warningColor: {
    backgroundColor: "rgb(255, 244, 229)",
  },
}));

const steps = [
  "Distance",
  "Goal Type",
  "Key Dates",
  "Runs Per Week",
  "Preferences",
  "Summary",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreatePlan() {
  const classes = useStyles();
  const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

  const [state, setState] = useContext(CreatePlanContext);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const [openRunsPerWeekWarning, setOpenRunsPerWeekWarning] = useState(false);

  const onContinueHandler = () => {
    setState({ ...state, step: state.step + 1, runsPerWeekError: false });
    setOpenRunsPerWeekWarning(false);
  };

  const onGoBackHandler = () => {
    setOpenRunsPerWeekWarning(false);
  };

  useEffect(() => {
    /*
     On entry to CreatePlan, we get our list of strava insights to be used throughout plan creation to
     provide personalised suggestions
    */
    axios
      .get(urls.StravaInsights, { params: { athlete_id: sessionStorage.athleteID } })
      .then((response) => {
        setLoading(false);
        const runsPerWeek = getRunsPerWeek(response.data["runs_per_week"]);
        setState({
          ...state,
          insightsFound: true,
          fiveKm: response.data["five_km"],
          tenKm: response.data["ten_km"],
          halfMarathon: response.data["half_marathon"],
          marathon: response.data["marathon"],
          // both these runsPerWeek values are assigned as one is to set the value and the other is to inform the user
          avgRunsPerWeek: runsPerWeek,
          runsPerWeek: runsPerWeek,
          modeLongRunDay: response.data["long_run_day"],
          additionalActivities: response.data["additional_activities"],
        });
      })
      .catch((error) => {
        setLoadingError(true);
        setLoading(false);
        console.log(error);
      });
  }, []);

  function getRunsPerWeek(rpw) {
    if (rpw <= 3.5) {
      return "2-3";
    } else if (rpw <= 5.5) {
      return "4-5";
    } else {
      return "6+";
    }
  }

  const handleSubmit = () => {
    const plan_data = {
      athlete_id: sessionStorage.athleteID,
      distance: state.distance,
      goal_type: state.goalType,
      goal_time: state.goalTime,
      start_date: state.startDate,
      finish_date: state.finishDate,
      runs_per_week: state.runsPerWeek,
      include_taper: state.includeTaper,
      include_cross_train: state.includeCrossTrain,
      long_run_day: state.longRunDay,
      blocked_days: state.blockedDays,
      name: state.planName,
    };

    axios
      .post(urls.Plans, plan_data, {})
      .then((response) => {
        setState({ ...state, planSubmitted: true, planSubmittedError: false });
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error while posting plan details");
        console.log(error);
        setState({ ...state, planSubmitted: false, planSubmittedError: true });
      });
  };

  const handleNext = () => {
    if (state.step === 3 && !state.runsPerWeek) {
      // Check if a value for RunsPerWeek has been provided on this form, if not an error is presented
      setState({ ...state, runsPerWeekError: true });
    } else if (state.step === 3 && state.runsPerWeek) {
      if (
        (state.avgRunsPerWeek === "2-3" &&
          ["4-5", "6+"].includes(state.runsPerWeek)) ||
        (state.avgRunsPerWeek === "4-5" && state.runsPerWeek === "6+")
      ) {
        setOpenRunsPerWeekWarning(true);
      } else {
        setState({ ...state, step: state.step + 1, runsPerWeekError: false });
      }
    } else {
      setState({ ...state, step: state.step + 1, runsPerWeekError: false });
    }
  };

  const handleBack = () => {
    setState({ ...state, step: state.step - 1 });
  };

  const onErrorClick = () => {
    window.location.href = "/";
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
      <Breadcrumbs
        className={classes.breadcrumb}
        style={{ fontSize: 14 }}
        separator="-"
      >
        <LinkRouter
          color="inherit"
          to={{
            pathname: urls.Dashboard,
          }}
        >
          Home
        </LinkRouter>
        <Typography color="textPrimary" style={{ fontSize: 14 }}>
          Create Plan
        </Typography>
      </Breadcrumbs>
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
              <Button
                onClick={handleBack}
                className={classes.button}
                disabled={
                  state.planSubmitted &&
                  !state.planSubmittedError &&
                  state.step === steps.length - 1
                }
              >
                Back
              </Button>
            )}
            {state.step !== 0 && state.step !== 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={state.step === 5 ? handleSubmit : handleNext}
                className={classes.button}
                // disabled={
                //   state.planSubmitted &&
                //   !state.planSubmittedError &&
                //   state.step === steps.length - 1
                // }
              >
                {state.step === steps.length - 1 ? "Create Plan" : "Next"}
              </Button>
            )}
          </div>
        </Paper>
      </main>

      {/* Dialog box for insights loading */}
      {loading && (
        <Dialog open={loading} TransitionComponent={Transition} keepMounted>
          <DialogTitle>
            <strong>Gathering your Strava run history ...</strong>
          </DialogTitle>
          <DialogContent>
            <CircularProgress className={classes.load} />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog box for insights loading */}
      {loadingError && (
        <Dialog
          open={loadingError}
          TransitionComponent={Transition}
          keepMounted
        >
          <DialogTitle>
            <strong>
              There was an error gathering your Strava run history.
            </strong>
          </DialogTitle>
          <DialogContent>
            <LinkRouter
              to={{
                pathname: urls.Dashboard,
              }}
            >
              <Button
                color="secondary"
                className={classes.error}
                onClick={onErrorClick}
              >
                Return to Dashboard
              </Button>
            </LinkRouter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog box for Runs Per Week */}
      {openRunsPerWeekWarning && (
        <Dialog
          open={openRunsPerWeekWarning}
          TransitionComponent={Transition}
          keepMounted
          onClose={onGoBackHandler}
        >
          <DialogTitle className={classes.warningColor}>
            <WarningRoundedIcon className={classes.icon} />
            {`Are you sure you'd like to select ${state.runsPerWeek} runs per week?`}
          </DialogTitle>
          <DialogContent dividers className={classes.warningColor}>
            <Typography gutterBottom>
              <p>
                Selecting a number of runs per week that is higher than your
                current 6 week average greatly increases the chance of you
                injuring yourself and thus failing to complete this training
                plan.
              </p>
              <p>
                We strongly advise you stick to the recommended runs per week (
                {state.avgRunsPerWeek})
              </p>
            </Typography>
          </DialogContent>
          <DialogActions className={classes.warningColor}>
            <Button onClick={onGoBackHandler} color="primary">
              Go Back
            </Button>
            <Button onClick={onContinueHandler} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Footer />
    </React.Fragment>
  );
}

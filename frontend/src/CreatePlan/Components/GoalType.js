import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import distance_goal from "../../assets/images/CreatePlan/distance-goal.jpg";
import time_goal from "../../assets/images/CreatePlan/time-goal.jpg";
import { TimePicker } from "antd";
import { CreatePlanContext } from "../CreatePlanContext";
import moment from "moment";
import * as strings from "../../assets/utils/strings";
import * as enums from "../../assets/utils/enums";
import { Alert, AlertTitle } from "@material-ui/lab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const cards = [
  {
    id: 1,
    title: "Distance Goal",
    photo: distance_goal,
    description:
      "A plan dedicated to being able to complete the distance, running non-stop.",
    value: enums.GoalType.DISTANCE,
  },
  {
    id: 2,
    title: "Time Goal",
    photo: time_goal,
    description:
      "A plan dedicated to running the distance in a specified amount of time.",
    value: enums.GoalType.TIME,
  },
];

const useStyles = makeStyles((theme) => ({
  insight: {
    padding: "16px",
    marginTop: theme.spacing(2),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    display: "flex",
  },
  button: {
    marginLeft: "auto",
    display: "inline-block",
    float: "right",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  time: {
    marginLeft: "auto",
    paddingRight: theme.spacing(1),
    position: "static",
    display: "inline-block",
  },
  alert: {
    marginBottom: theme.spacing(2),
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GoalTypeForm() {
  // This is the second form in the CreatePlan flow, it allows the user to select a goal type for their plan
  // and suggests to them if they should go for distance or time (also what time to go for)

  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);
  const [goalTimeError, setGoalTimeError] = useState({
    isError: false,
    message: "",
  });
  const [openTimeInput, setOpenTimeInput] = useState(false);
  const [goalWarning, setGoalWarning] = useState(false);
  const [recommendGoal, setRecommendedGoal] = useState();

  var distance;
  var time;
  var minTime;
  // get distance and time info for display in goal time input and the min selectable time
  if (state.distance === enums.Distance.FIVE_KM) {
    distance = "5K";
    time = state.fiveKm.time;
    minTime = moment("00:15:00", "HH:mm:ss");
  } else if (state.distance === enums.Distance.TEN_KM) {
    distance = "10K";
    time = state.tenKm.time;
    minTime = moment("00:30:00", "HH:mm:ss");
  } else if (state.distance === enums.Distance.HALF_MARATHON) {
    distance = "half marathon";
    time = state.halfMarathon.time;
    minTime = moment("01:00:00", "HH:mm:ss");
  } else if (state.distance === enums.Distance.MARATHON) {
    distance = "marathon";
    time = state.marathon.time;
    minTime = moment("02:00:00", "HH:mm:ss");
  }

  useEffect(() => {
    // find the recommended time goal for the distance they have selected
    if (
      (state.distance === enums.Distance.FIVE_KM && !state.fiveKm.completed) ||
      (state.distance === enums.Distance.TEN_KM && !state.tenKm.completed) ||
      (state.distance === enums.Distance.HALF_MARATHON &&
        !state.halfMarathon.completed) ||
      (state.distance === enums.Distance.MARATHON && !state.marathon.completed)
    ) {
      setRecommendedGoal(enums.GoalType.DISTANCE);
    } else if (
      (state.distance === enums.Distance.FIVE_KM && state.fiveKm.completed) ||
      (state.distance === enums.Distance.TEN_KM && state.tenKm.completed) ||
      (state.distance === enums.Distance.HALF_MARATHON &&
        state.halfMarathon.completed) ||
      (state.distance === enums.Distance.MARATHON && state.marathon.completed)
    ) {
      setRecommendedGoal(enums.GoalType.TIME);
    }
  }, []);

  function onClickHandler(goal) {
    if (goal === "Distance Goal") {
      setState({
        ...state,
        step: state.step + 1,
        goalType: enums.GoalType.DISTANCE,
        goalTime: null,
      });
    } else if (
      goal === "Time Goal" &&
      recommendGoal === enums.GoalType.DISTANCE
    ) {
      setGoalWarning(true);
    } else {
      setState({
        ...state,
        goalType: enums.GoalType.TIME,
      });
      setOpenTimeInput(true);
    }
  }
  function handleNext() {
    if (state.goalTime) {
      setState({ ...state, step: state.step + 1 });
    } else {
      setGoalTimeError({
        ...goalTimeError,
        isError: true,
        message: strings.GoalTimeError,
      });
    }
  }

  function onChange(time, timeString) {
    if (time !== null) {
      if (time.hours() < minTime.hours()) {
        setGoalTimeError({
          ...goalTimeError,
          isError: true,
          message: `The minimum selectable time for a ${distance} is ${minTime.format(
            "HH:mm:ss"
          )}`,
        });
      } else if (time.hours() > minTime.hours()) {
        setState({
          ...state,
          goalType: enums.GoalType.TIME,
          goalTime: timeString,
        });
        setGoalTimeError({ ...goalTimeError, isError: false, message: "" });
      } else if (time.hours() === minTime.hours()) {
        if (time.minutes() >= minTime.minutes()) {
          setState({
            ...state,
            goalType: enums.GoalType.TIME,
            goalTime: timeString,
          });
          setGoalTimeError({ ...goalTimeError, isError: false, message: "" });
        } else {
          setGoalTimeError({
            ...goalTimeError,
            isError: true,
            message: `The minimum selectable time for a ${distance} is ${minTime.format(
              "HH:mm:ss"
            )}`,
          });
        }
      }
    } else {
      setState({
        ...state,
        goalType: enums.GoalType.TIME,
        goalTime: timeString,
      });
      setGoalTimeError({ ...goalTimeError, isError: false, message: "" });
    }
  }

  const onGoBackHandler = () => {
    setOpenTimeInput(false);
    setGoalTimeError({ ...goalTimeError, isError: false, message: "" });
    setGoalWarning(false);
  };

  const onContinueHandler = () => {
    setOpenTimeInput(true);
    setGoalWarning(false);
  };

  return (
    <React.Fragment>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={8} md={6}>
          <Card
            className={classes.card}
            variant="outlined"
            style={{
              borderColor: state.goalType === card.value ? "limegreen" : "none",
              borderWidth: state.goalType === card.value ? 5 : "none",
            }}
          >
            <CardMedia className={classes.cardMedia} image={card.photo} />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h6" component="h2">
                <b>{card.title}</b>
              </Typography>
              <Typography>
                {card.description}
                {card.id === 1 && recommendGoal === enums.GoalType.DISTANCE && (
                  <Alert severity="info" className={classes.insight}>
                    <AlertTitle>
                      <strong>Recommended</strong> -{" "}
                    </AlertTitle>
                    Having never ran a {state.distance.toLowerCase()}, we
                    recommend you just aim go the distance, rather than aiming
                    for a specific time.
                  </Alert>
                )}
                {card.id === 2 && recommendGoal === enums.GoalType.TIME && (
                  <Alert severity="info" className={classes.insight}>
                    <AlertTitle>
                      <strong>Recommended</strong> -{" "}
                    </AlertTitle>
                    Seeing as you've ran a {state.distance.toLowerCase()}{" "}
                    before, we recommend you aim to run it in a specific time.
                  </Alert>
                )}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onClickHandler(card.title)}
              >
                Select
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}

      {/* Dialog box for goal type warning */}
      {goalWarning && (
        <Dialog
          open={goalWarning}
          TransitionComponent={Transition}
          keepMounted
          onClose={onGoBackHandler}
        >
          <DialogTitle className={classes.warningColor}>
            <WarningRoundedIcon className={classes.icon} />
            <strong>Are you sure you'd like to select this goal type?</strong>
          </DialogTitle>
          <DialogContent dividers className={classes.warningColor}>
            <Typography gutterBottom>
              <p>
                Due to the fact we can't see any runs of this distance on your
                Strava. We strongly recommend you aim for a distance goal.
              </p>
              <p>
                This is because time based training plans expect you to be able
                to run the whole distance (or near to) from the beginning. This
                means that if you are not fully prepared, you increase your risk
                of injury which will greatly decrease your chances of completing
                the plan.
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

      {/* Dialog box for goal time input */}
      {openTimeInput && (
        <Dialog
          open={openTimeInput}
          TransitionComponent={Transition}
          keepMounted
          onClose={onGoBackHandler}
        >
          <DialogTitle>
            <strong>Please enter your goal time:</strong>
          </DialogTitle>
          <DialogContent dividers>
            {time !== "00:00" && (
              <p>
                <b>
                  You completed your fastest {distance} in {time}
                </b>
              </p>
            )}
            <p>Your goal time should be in the form HH:MM:SS. </p>
            {goalTimeError.isError && (
              <Alert severity="error" className={classes.alert}>
                {goalTimeError.message}
              </Alert>
            )}
            <div>
              <TimePicker
                onChange={onChange}
                showNow={false}
                value={
                  state.goalTime
                    ? moment(state.goalTime, "HH:mm:ss")
                    : moment("00:00:00", "HH:mm:ss")
                }
                size="large"
                secondStep={15}
              />
            </div>
            <br></br>
            <a
              href="https://www.runnersworld.com/uk/training/a761681/rws-race-time-predictor/"
              target="_blank"
            >
              If you are unsure, click here to use a race time predictor
            </a>
          </DialogContent>
          <DialogActions>
            <Button onClick={onGoBackHandler} color="primary">
              Go Back
            </Button>
            <Button onClick={handleNext} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

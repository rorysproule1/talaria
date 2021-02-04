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
import Modal from "@material-ui/core/Modal";
import moment from "moment";
import * as strings from "../../assets/utils/strings";
import * as enums from "../../assets/utils/enums";
import { Alert, AlertTitle } from "@material-ui/lab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
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
  title: {
    padding: "16px",
    marginTop: theme.spacing(1),
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GoalTypeForm() {
  // This is the second form in the CreatePlan flow, it allows the user to select a goal type for their plan
  // and suggests to them if they should go for distance or time (also what time to go for)

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [state, setState] = useContext(CreatePlanContext);
  const [goalTimeError, setGoalTimeError] = useState(false);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [recommendGoal, setRecommendedGoal] = useState();

  useEffect(() => {
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
      setOpenWarningModal(true);
    } else {
      setState({
        ...state,
        goalType: enums.GoalType.TIME,
      });
      setOpenTimeModal(true);
    }
  }
  function handleNext() {
    if (state.goalTime) {
      setState({ ...state, step: state.step + 1 });
    } else {
      setGoalTimeError(true);
    }
  }

  function onChange(time, timeString) {
    setState({ ...state, goalType: enums.GoalType.TIME, goalTime: timeString });
  }

  const handleClose = () => {
    setOpenTimeModal(false);
    setGoalTimeError(false);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const goBackHandler = () => {
    setOpenWarningModal(false);
  };

  const onContinueHandler = () => {
    setOpenTimeModal(true);
    setOpenWarningModal(false);
  };

  // HTML for Goal Time Modal
  const modalTimeBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2>
        <b>Please enter your goal time:</b>
      </h2>
      <p>Your goal time should be in the form HH:MM:SS. </p>
      {goalTimeError && (
        <Alert severity="error" className={classes.alert}>
          {strings.GoalTimeError}
        </Alert>
      )}
      <div className={classes.input}>
        <TimePicker
          onChange={onChange}
          className={classes.time}
          showNow={false}
          value={
            state.goalTime
              ? moment(state.goalTime, "HH:mm:ss")
              : moment("00:00:00", "HH:mm:ss")
          }
          size="large"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
        >
          SET
        </Button>
      </div>

      <Modal />
    </div>
  );

  return (
    <React.Fragment>
      <div>
        <Modal open={openTimeModal} onClose={handleClose}>
          {modalTimeBody}
        </Modal>
      </div>
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
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                style={{ fontWeight: "bold" }}
              >
                {card.title}
              </Typography>
              <Typography>
                {card.description}
                {card.id === 1 && recommendGoal === enums.GoalType.DISTANCE && (
                  <Alert severity="info" className={classes.title}>
                    <AlertTitle>
                      <strong>Recommended</strong> -{" "}
                    </AlertTitle>
                    Having never ran a {state.distance.toLowerCase()}, we
                    recommend you just aim to complete it, rather than aim for a
                    specific time.
                  </Alert>
                )}
                {card.id === 2 && recommendGoal === enums.GoalType.TIME && (
                  <Alert severity="info" className={classes.title}>
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
      {openWarningModal && (
        <Dialog
          open={openWarningModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={goBackHandler}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            id="alert-dialog-slide-title"
            style={{ "background-color": "rgb(255, 244, 229)" }}
          >
            <WarningRoundedIcon className={classes.icon} />
            {`Use a time goal for your training plan?`}
          </DialogTitle>
          <DialogContent
            dividers
            style={{ backgroundColor: "rgb(255, 244, 229)" }}
          >
            <DialogContentText id="alert-dialog-slide-description">
              <p>
                Due to the fact we can't see any runs on your Strava history
                that have completed this distance. We strongly recommend you aim
                for a distance goal.
              </p>
              <p>
                This is because time based training plans expect you to be able
                to run the whole distance (or near to) from the beginning. This
                means that if you are not fully prepared, you increase your risk
                of injury which will greatly decrease your chances of completing
                the plan.
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ "background-color": "rgb(255, 244, 229)" }}>
            <Button onClick={goBackHandler} color="primary">
              Go Back
            </Button>
            <Button onClick={onContinueHandler} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

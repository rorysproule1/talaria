import React, { useContext, useState } from "react";
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
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import * as strings from "../../assets/utils/strings";
import * as enums from "../../assets/utils/enums";

const cards = [
  {
    id: 1,
    title: "Distance Goal",
    photo: distance_goal,
    description:
      "A plan dedicated to being able to complete the distance, running non-stop.",
  },
  {
    id: 2,
    title: "Time Goal",
    photo: time_goal,
    description:
      "A plan dedicated to running the distance in a set amount of time.",
  },
];

const useStyles = makeStyles((theme) => ({
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
}));

export default function GoalTypeForm() {
  // This is the second form in the CreatePlan flow, it allows the user to select a goal type for their plan
  // and suggests to them if they should go for distance or time (also what time to go for)

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [state, setState] = useContext(CreatePlanContext);
  const [goalTimeError, setGoalTimeError] = useState(false);
  const [open, setOpen] = useState(false);

  function onClickHandler(goal) {
    if (goal === "Distance Goal") {
      setState({
        ...state,
        step: state.step + 1,
        goalType: enums.GoalType.DISTANCE,
        goalTime: null,
      });
    } else {
      setState({
        ...state,
        goalType: enums.GoalType.TIME,
      });
      setOpen(true);
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
    setState({ ...state, goalTime: timeString });
  }

  const handleClose = () => {
    setOpen(false);
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

  // HTML for Goal Time Modal
  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2>
        <b>Please enter your goal time:</b>
      </h2>
      <p>Your goal time should be in the form HH:MM:SS</p>
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
        <Modal open={open} onClose={handleClose}>
          {modalBody}
        </Modal>
      </div>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={8} md={6}>
          <Card className={classes.card}>
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
              <Typography>{card.description}</Typography>
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
    </React.Fragment>
  );
}

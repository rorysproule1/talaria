import React, { useContext, getModalStyle, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import distance_goal from "../assets/images/CreatePlan/distance-goal.jpg";
import time_goal from "../assets/images/CreatePlan/time-goal.jpg";
import { TimePicker } from "antd";
import { CreatePlanContext } from "./CreatePlanContext";
import Modal from "@material-ui/core/Modal";

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
    paddingRight: theme.spacing(1),
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
    position: "static"
  },
}));

export default function GoalTypeForm() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [state, setState] = useContext(CreatePlanContext);
  const [open, setOpen] = useState(false);

 

  function onClickHandler(goal) {
    if (goal === "Distance Goal") {
      setState({ ...state, step: state.step + 1, goalType: "DISTANCE" });
    } else {
      // setState({ ...state, step: state.step + 1, goalType: "TIME" });
      setOpen(true)
    }
  }

  function onChange(time, timeString) {
    setState({ ...state, goalTime: timeString });
  } 
  
  const handleClose = () => {
    setOpen(false);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      ZIndex: 10000,
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      ZIndex: 10000,
    };
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2>Please enter your desired goal time in (hh:mm:ss):</h2>
      <p>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      <TimePicker onChange={onChange} className={classes.time} autoFocus/>
      <Modal />
    </div>
  );

  return (
    <React.Fragment>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={8} md={6}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.cardMedia}
              image={card.photo}
              title="Image title"
            />
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

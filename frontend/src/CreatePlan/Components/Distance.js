import React, { useContext, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import fiveKilometre from "../../assets/images/CreatePlan/five-kilometre.jpg";
import tenKilometre from "../../assets/images/CreatePlan/ten-kilometre.jpg";
import halfMarathon from "../../assets/images/CreatePlan/half-marathon.jpg";
import marathon from "../../assets/images/CreatePlan/marathon.jpg";
import { CreatePlanContext } from "../CreatePlanContext";
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
    title: "5K Plan",
    photo: fiveKilometre,
    description:
      "A great place to start for beginners and a tried and tested distance for experienced runners to test their VO2 max.",
    value: enums.Distance.FIVE_KM,
  },
  {
    id: 2,
    title: "10K Plan",
    photo: tenKilometre,
    description:
      "Beginning to put your lactate threshold to the test, great place to introduce yourself to distance running.",
    value: enums.Distance.TEN_KM,
  },
  {
    id: 3,
    title: "Half-Marathon Plan",
    photo: halfMarathon,
    description:
      "Endurance running at it's best, brilliant goal to aim for whether it's just finishing or aiming for an impressive time. (21.1Km)",
    value: enums.Distance.HALF_MARATHON,
  },
  {
    id: 4,
    title: "Marathon Plan",
    photo: marathon,
    description:
      "The big one, an endurance challenge you'll never forget. (42.2Km)",
    value: enums.Distance.MARATHON,
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
    paddingRight: theme.spacing(2),
  },
  insight: {
    padding: "16px",
    marginTop: theme.spacing(2),
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

export default function DistanceForm() {
  // This is the first form in the CreatePlan flow, it allows the user to select a distance for their plan
  // and suggests to them a distance based off their runs on Strava
  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);
  const [tempDistance, setTempDistance] = useState();
  const [distanceWarning, setDistanceWarning] = useState(false);

  function onClickHandler(distance) {
    if (distance === "5K Plan") {
      setState({
        ...state,
        step: state.step + 1,
        distance: enums.Distance.FIVE_KM,
      });
    } else if (distance === "10K Plan") {
      if (!state.fiveKm.completed) {
        setDistanceWarning(true);
        setTempDistance(enums.Distance.TEN_KM);
      } else {
        setState({
          ...state,
          step: state.step + 1,
          distance: enums.Distance.TEN_KM,
        });
      }
    } else if (distance === "Half-Marathon Plan") {
      if (!state.tenKm.completed) {
        setDistanceWarning(true);
        setTempDistance(enums.Distance.HALF_MARATHON);
      } else {
        setState({
          ...state,
          step: state.step + 1,
          distance: enums.Distance.HALF_MARATHON,
        });
      }
    } else if (distance === "Marathon Plan") {
      if (!state.halfMarathon.completed) {
        setDistanceWarning(true);
        setTempDistance(enums.Distance.MARATHON);
      } else {
        setState({
          ...state,
          step: state.step + 1,
          distance: enums.Distance.MARATHON,
        });
      }
    }
  }

  const goBackHandler = () => {
    setDistanceWarning(false);
  };

  const onContinueHandler = () => {
    setState({
      ...state,
      distance: tempDistance,
      step: state.step + 1,
    });
  };

  return (
    <React.Fragment>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={8} md={6}>
          <Card
            className={classes.card}
            variant="outlined"
            style={{
              borderColor: state.distance === card.value ? "limegreen" : "none",
              borderWidth: state.distance === card.value ? 5 : "none",
            }}
          >
            <CardMedia className={classes.cardMedia} image={card.photo} />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h6" component="h2">
                <b>{card.title}</b>
              </Typography>
              <Typography>
                {card.description}
                <p></p>
                {card.id === 1 && state.fiveKm.completed && (
                  <Typography variant="body2" gutterBottom>
                    <b>You last ran a 5K on {state.fiveKm.date}</b>
                  </Typography>
                )}
                {card.id === 2 && state.tenKm.completed && (
                  <Typography variant="body2" gutterBottom>
                    <b>You last ran a 10K on {state.tenKm.date}</b>
                  </Typography>
                )}
                {card.id === 3 && state.halfMarathon.completed && (
                  <Typography variant="body2" gutterBottom>
                    <b>
                      You last ran a half marathon on {state.halfMarathon.date}
                    </b>
                  </Typography>
                )}
                {card.id === 4 && state.marathon.completed && (
                  <Typography variant="body2" gutterBottom>
                    <b>You last ran a marathon on {state.marathon.date}</b>
                  </Typography>
                )}

                {state.insightsFound &&
                  card.id === 1 &&
                  !state.fiveKm.completed && (
                    <Alert severity="info" className={classes.insight}>
                      <AlertTitle>
                        <strong>Recommended</strong> -{" "}
                      </AlertTitle>
                      Looking at your Strava history, we see you've never ran
                      5K. We recommend you start here.
                    </Alert>
                  )}
                {card.id === 2 &&
                  state.fiveKm.completed &&
                  !state.tenKm.completed && (
                    <Alert severity="info" className={classes.insight}>
                      <AlertTitle>
                        <strong>Recommended</strong> -{" "}
                      </AlertTitle>
                      Looking at your Strava history, we see you've never ran
                      10K. We recommend you aim for this.
                    </Alert>
                  )}
                {card.id === 3 &&
                  state.fiveKm.completed &&
                  state.tenKm.completed &&
                  !state.halfMarathon.completed && (
                    <Alert severity="info" className={classes.insight}>
                      <AlertTitle>
                        <strong>Recommended</strong> -{" "}
                      </AlertTitle>
                      Looking at your Strava history, we see you've never ran a
                      half marathon. We recommend you aim for this.
                    </Alert>
                  )}
                {card.id === 4 &&
                  state.fiveKm.completed &&
                  state.tenKm.completed &&
                  state.halfMarathon.completed &&
                  !state.marathon.completed && (
                    <Alert severity="info" className={classes.insight}>
                      <AlertTitle>
                        <strong>Recommended</strong> -{" "}
                      </AlertTitle>
                      Looking at your Strava history, we see you've never ran a
                      marathon. We recommend you aim for this.
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

      {/* Dialog box for distance warning */}
      {distanceWarning && (
        <Dialog
          open={distanceWarning}
          TransitionComponent={Transition}
          keepMounted
          onClose={goBackHandler}
        >
          <DialogTitle className={classes.warningColor}>
            <WarningRoundedIcon className={classes.icon} />
            <strong>Are you sure you'd like to select this distance?</strong>
          </DialogTitle>
          <DialogContent dividers className={classes.warningColor}>
            <Typography gutterBottom>
              <p>
                We notice you've never ran {tempDistance.toLowerCase()} on
                Strava before.
              </p>
              <p>
                Selecting a distance that you aren't prepared for increases the
                risk of overexertion. This can lead to injury which will greatly
                decrease your chances of completing the plan.
              </p>
              <p>
                We strongly advise you select the distance recommended to you,
                and gradually build your fitness towards this desired distance.
              </p>
            </Typography>
          </DialogContent>
          <DialogActions className={classes.warningColor}>
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

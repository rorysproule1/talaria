import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import fiveKilometre from "../assets/images/CreatePlan/five-kilometre.jpg";
import tenKilometre from "../assets/images/CreatePlan/ten-kilometre.jpg";
import halfMarathon from "../assets/images/CreatePlan/half-marathon.jpg";
import marathon from "../assets/images/CreatePlan/marathon.jpg";

const cards = [
  {
    id: 1,
    title: "5km Plan",
    photo: fiveKilometre,
    description:
      "A great place to start for beginners and a tried and tested distance for experienced runners to test their VO2 max.",
  },
  {
    id: 2,
    title: "10km Plan",
    photo: tenKilometre,
    description:
      "Beginning to put your lactate threshold to the test, great place to introduce yourself to distance running.",
  },
  {
    id: 3,
    title: "Half Marathon Plan",
    photo: halfMarathon,
    description:
      "Endurance running at it's best, brilliant goal to aim for whether it's just finishing or aiming for an impressive time.",
  },
  {
    id: 4,
    title: "Marathon Plan",
    photo: marathon,
    description: "The big one, an endurance challenge you'll never forget.",
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
}));

export default function DistanceForm({ access_token }) {
  const classes = useStyles();

  const accessToken = access_token;
  const [distance, setDistance] = useState();

  useEffect(() => {
    const body = document.querySelector("#root");
    body.scrollIntoView();

    console.log(access_token);
    // axios
    //   .get(`/strava-insights`, { params: { access_token: accessToken } })
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []); // empty list to ensure code is only executed on initial loading of the page

  function onClickHandler(distance) {
    if (distance == "5km Plan") {
      setDistance("5km");
    } else if (distance === "10km Plan") {
      setDistance("10km");
    } else if (distance === "Half Marathon Plan") {
      setDistance("Half Marathon");
    } else if (distance === "Marathon Plan") {
      setDistance("Marathon");
    }
  }

  return (
    <React.Fragment>
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

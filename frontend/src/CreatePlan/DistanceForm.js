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
    title: "5km Plan",
    photo: fiveKilometre,
    description:
      "A great place to start for beginners and a tried and tested distance for experienced runners to test their VO2 max.",
  },
  {
    title: "10km Plan",
    photo: tenKilometre,
    description:
      "Beginning to put your lactate threshold to the test, great place to introduce yourself to distance running.",
  },
  {
    title: "Half Marathon",
    photo: halfMarathon,
    description:
      "Endurance running at it's best, brilliant goal to aim for whether it's just finishing or aiming for an impressive time.",
  },
  {
    title: "Marathon",
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

  const [accessToken, setAccessToken] = useState(access_token);
  const [distance, setDistance] = useState();
  // const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
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

  function onChangeHandler(e) {
    // setEndDate(e);
    console.log(e);
    console.log(Date(e))
  }

  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Please select a distance for your plan:
      </Typography> */}

      {/* <DatePicker onChange={onChangeHandler} value={endDate} minDate={new Date()} isOpen={isOpen}/> */}

      {cards.map((card) => (
        <Grid item key={card} xs={16} sm={8} md={6}>
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
                onClick={(e) => setDistance(card.title)}
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

import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import DatePicker from "react-date-picker";
import fiveKilometre from "../assets/images/five-kilometre.jpg";
import tenKilometre from "../assets/images/ten-kilometre.jpg";
import path from "../assets/images/path.jpg";
import stopwatch from "../assets/images/stopwatch.jpg";

const cards = [
  {
    title: "Distance Plan",
    photo: path,
    description:
      "A plan dedicated to being able to complete the distance, running non-stop.",
  },
  {
    title: "Time Plan",
    photo: stopwatch,
    description:
      "A plan dedicated to running the distance in a set amount of time.",
  },
];

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
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
    paddingRight: theme.spacing(2),
  },
}));

export default function PlanTypeForm({ access_token }) {
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
  }

  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Please select a distance for your plan:
      </Typography> */}

      {/* <DatePicker onChange={onChangeHandler} value={endDate} minDate={new Date()} isOpen={isOpen}/> */}

      <Grid container spacing={3}>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
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
          </Grid>
        </Container>
      </Grid>
    </React.Fragment>
  );
}

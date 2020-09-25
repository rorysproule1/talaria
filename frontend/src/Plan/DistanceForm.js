import React from "react";
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

const cards = [
  {
    title: "5km Plan",
    photo: "https://source.unsplash.com/random?sprinting",
    description: "A great place to start for beginners and a tried and tested distance for experienced runners to test their VO2 max."
  },
  {
    title: "10km Plan",
    photo: "https://source.unsplash.com/random?running",
    description: "Beginning to put your lactate threshold to the test, great place to introduce yourself to distance running."
  },
  {
    title: "Half Marathon",
    photo: "https://source.unsplash.com/random?half-marathon",
    description: "Endurance running at it's best, brilliant goal to aim for whether it's just finishing or aiming for an impressive time."
  },
  {
    title: "Marathon",
    photo: "https://source.unsplash.com/random?marathon",
    description: "The big one, an endurance challenge you'll never forget."
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
}));

export default function DistanceForm() {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* <Typography variant="h6" gutterBottom>
        Please select a distance for your plan:
      </Typography> */}

      <Grid container spacing={3}>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4} auto>
          {cards.map((card) => (
            <Grid item key={card} xs={16} sm={8} md={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.photo}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h6" component="h2" style={{fontWeight:"bold"}}>
                    {card.title}
                  </Typography>
                  <Typography>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Grid>
    </React.Fragment>
  );
}

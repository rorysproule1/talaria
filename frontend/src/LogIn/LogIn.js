import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AssignmentIcon from "@material-ui/icons/Assignment";
import TimelineIcon from "@material-ui/icons/Timeline";
import CreateIcon from "@material-ui/icons/Create";
import useStyles from "./CSS/LogInCSS";
import Header from "../assets/js/Header";
import Footer from "../assets/js/Footer";

const tiers = [
  {
    title: "Plan",
    description: [
      "Create a customised plan",
      "for anything from your first 5km",
      "to striving for a sub 3 hour ",
      "marathon!",
      "_____",
    ],
  },
  {
    title: "Track",
    description: [
      "Using your Strava run data,",
      "we keep track of which runs you",
      "are doing and how you are",
      "finding them.",
      "_____",
    ],
  },
  {
    title: "Analyse",
    description: [
      "Using a dynamic training plan,",
      "We continually analyse your runs",
      "and provide feedback on your",
      "progress.",
      "_____",
    ],
  },
];

export default function Login() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Header connectToStrava={true} />
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Welcome to Talaria!
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          Helping you achieve your running goals through customisable training
          programs highly tailored to your personal running level.
        </Typography>
      </Container>
      <Container maxWidth="md">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    {tier.title === "Plan" && (
                      <CreateIcon fontSize="large" color="primary" />
                    )}
                    {tier.title === "Track" && (
                      <AssignmentIcon fontSize="large" color="primary" />
                    )}
                    {tier.title === "Analyse" && (
                      <TimelineIcon fontSize="large" color="primary" />
                    )}
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

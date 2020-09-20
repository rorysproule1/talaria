import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AssignmentIcon from "@material-ui/icons/Assignment";
import TimelineIcon from "@material-ui/icons/Timeline";
import CreateIcon from "@material-ui/icons/Create";
import powered_by_strava from "../assets/images/powered_by_strava.png";
import strava_connect from "../assets/images/btn_strava_connect.png";
import talaria_logo_circle from "../assets/images/logo-talaria-circle.png";
import axios from "axios";

function Copyright() {
  return (
    <p align="center">
      <img
        src={powered_by_strava}
        style={({ height: "96px" }, { width: "144px" })}
        class="center"
      />
    </p>
  );
}

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  logo: {
    width: "36px",
    marginRight: "10px",
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const tiers = [
  {
    title: "Plan",
    description: [
      "Create a customised plan",
      "for anything from your first 5km",
      "to striving for a sub 3 hour ",
      "marathon!",
    ],
  },
  {
    title: "Track",
    description: [
      "Using your Strava run data,",
      "we keep track of which runs you",
      "are doing and how you are",
      "finding them.",
    ],
  },
  {
    title: "Analyse",
    description: [
      "Using a dynamic training plan,",
      "We continually analyse your",
      "runs and adapt the plan if",
      "necessary.",
    ],
  },
];

export default function Login() {
  const classes = useStyles();
  const authUrl =
    "https://www.strava.com/oauth/authorize?client_id=52053&redirect_uri=http://localhost:3000/login&response_type=code&scope=activity:read_all";
  const [connectToStrava, setConnectToStrava] = useState(false);

  useEffect(() => {  
    var url_string = window.location.href;
    var url = new URL(url_string);
    var code = url.searchParams.get("code");
    var scope = url.searchParams.get("scope");

    if (code && scope.includes("activity:read_all")) {
      const token_url = "https://www.strava.com/oauth/token"
      const post_data = {
        client_id: 52053,
        client_secret: "652aa8ebedc48c9fcf061fb28f663b6eca0669a6",
        code: code,
        grant_type: "authorization_code",
      }

      axios.post(token_url, post_data, {})
      .then((response) => {
        console.log(response.data)
        var access_token = response.data["access_token"]
        var refresh_token = response.data["refresh_token"]
        var currentDate = new Date()
        currentDate.setSeconds(currentDate.getSeconds() + response.data["expires_in"])
        var expires_at = currentDate

        var athlete_id = response.data["athlete"]["id"]
        var first_name = response.data["athlete"]["firstname"]
        var last_name = response.data["athlete"]["lastname"]
        var sex = response.data["athlete"]["sex"]

        console.log(access_token + "\n" + refresh_token + "\n" + expires_at)
        console.log(athlete_id + "\n" + first_name + "\n" + last_name)
      })
      .catch((error) => {
        console.error('Error while posting for token')
        console.log(error)
      })
    }
    

  }, []); // empty list to ensure code is only executed on initial loading of the page

  function onClickHandler(e) {
    setConnectToStrava(true);

    // redirect to Strava oAuth
    window.location.href = authUrl;
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <img
            src={talaria_logo_circle}
            className={classes.logo}
          />
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            <b>Talaria - Running Training Planner</b>
          </Typography>
          <input
            type="image"
            id="strava-connect"
            style={({ height: "96px" }, { width: "144px" })}
            src={strava_connect}
            onClick={onClickHandler}
          />
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
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
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
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
      {/* Footer */}
      <Container maxWidth="md" component="footer" className={classes.footer}>
        <Copyright />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

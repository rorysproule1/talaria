import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import strava_connect from "../images/Strava/strava-connect.png";
import talaria_logo_circle from "../images/Logo/talaria-circle.png";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import * as strings from "../utils/strings";
import * as urls from "../utils/urls";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  logo: {
    width: "36px",
    marginRight: "10px",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Header({ connectToStrava }) {
  const classes = useStyles();

  const [athleteID, setAthleteID] = useState();
  const [logOut, setLogOut] = useState(false);
  const [credentialsAuthorized, setCredentialsAuthorized] = useState(false);
  const [credentialsError, setCredentialsError] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {
    if (connectToStrava) {
      // oAuth returns the one time usage code and the scope in the url
      // so we check if these are present, if so we continue with authentication
      var urlString = window.location.href;
      var url = new URL(urlString);

      var code = url.searchParams.get("code");
      var scope = url.searchParams.get("scope");

      // on entry to the page, if we have been redirected with a code and correct scope in the URL, we can request an access token
      if (code && scope.includes("activity:read_all")) {
        const oauth_data = {
          client_id: 52053,
          client_secret: "652aa8ebedc48c9fcf061fb28f663b6eca0669a6",
          code: code,
          grant_type: "authorization_code",
        };

        axios
          .post(urls.StravaToken, oauth_data, {})
          .then((response) => {
            // to prevent excessive polling of the strava api, we store the time and date that the access token
            // expires at and check it before using the api
            var currentDate = new Date();
            currentDate.setSeconds(
              currentDate.getSeconds() + response.data["expires_in"]
            );
            var expires_at = currentDate;

            var athlete_data = {
              access_token: response.data["access_token"],
              refresh_token: response.data["refresh_token"],
              expires_at: expires_at,
              strava_id: response.data["athlete"]["id"],
            };

            // we then post these details to our API to be stored about the athlete
            axios
              .post(urls.Athletes, athlete_data, {})
              .then((response) => {
                sessionStorage.setItem("athleteID", response.data["athlete_id"])
                setAthleteID(response.data["athlete_id"]);
                setCredentialsAuthorized(true);
              })
              .catch((error) => {
                console.error("Error while posting athlete");
                console.log(error);
                setCredentialsError({
                  ...credentialsError,
                  isError: true,
                  message: strings.AthleteDetailsError,
                });
              });
          })
          .catch((error) => {
            console.error("Error while posting for authorization code");
            console.log(error);
            setCredentialsError({
              ...credentialsError,
              isError: true,
              message: strings.InvalidCodeError,
            });
          });
      } else if (code && !scope.includes("activity:read_all")) {
        // a read_all scope has not been provided, so output an error
        setCredentialsError({
          ...credentialsError,
          isError: true,
          message: strings.InvalidScopeError,
        });
      }
    }
  }, []); // empty list to ensure code is only executed on initial loading of the page

  function onLogInHandler(e) {
    // redirect to Strava oAuth
    window.location.href = urls.StravaAuthorization;
  }

  function onLogOutHandler(e) {
    // clear session storage
    sessionStorage.clear()
    setLogOut(true);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCredentialsError({
      ...credentialsError,
      isError: false,
      message: "",
    });
  };

  return (
    <React.Fragment>
      {credentialsAuthorized && (
        <Redirect
          to={{
            pathname: urls.Dashboard,
          }}
        />
      )}
      {logOut && (
        <Redirect
          to={{
            pathname: urls.Login,
          }}
        />
      )}
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <img src={talaria_logo_circle} className={classes.logo} alt="logo" />
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            <b>Talaria - Running Training Planner</b>
          </Typography>
          {connectToStrava ? (
            <input
              type="image"
              id="strava-connect"
              style={({ height: "96px" }, { width: "144px" })}
              src={strava_connect}
              onClick={onLogInHandler}
            />
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={onLogOutHandler}
            >
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Snackbar
        open={credentialsError.isError}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          ERROR: {credentialsError.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

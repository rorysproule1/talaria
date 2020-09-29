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
}));

export default function Header({ connectToStrava, logOut }) {
  const classes = useStyles();

  const authUrl =
    "https://www.strava.com/oauth/authorize?client_id=52053&redirect_uri=http://localhost:3000/login&response_type=code&scope=activity:read_all";

  const [accessToken, setAccessToken] = useState();
  const [credentialsAuthorized, setCredentialsAuthorized] = useState(false);

  useEffect(() => {
    if (connectToStrava) {
      var url_string = window.location.href;
      var url = new URL(url_string);
      var code = url.searchParams.get("code");
      var scope = url.searchParams.get("scope");

      if (code && scope.includes("activity:read_all")) {
        const token_url = "https://www.strava.com/oauth/token";
        const post_data = {
          client_id: 52053,
          client_secret: "652aa8ebedc48c9fcf061fb28f663b6eca0669a6",
          code: code,
          grant_type: "authorization_code",
        };

        axios
          .post(token_url, post_data, {})
          .then((response) => {
            // to prevent excessive polling of the strava api, we store the time and date that the access token
            // expires at and check it before using the api
            var currentDate = new Date();
            currentDate.setSeconds(
              currentDate.getSeconds() + response.data["expires_in"]
            );
            var expires_at = currentDate;

            var response_data = {
              access_token: response.data["access_token"],
              refresh_token: response.data["refresh_token"],
              expires_at: expires_at,
              athlete_id: response.data["athlete"]["id"],
              first_name: response.data["athlete"]["firstname"],
              last_name: response.data["athlete"]["lastname"],
              sex: response.data["athlete"]["sex"],
            };
            console.log(response_data);

            setAccessToken(response_data["access_token"]);
            setCredentialsAuthorized(true);

            // we then need to post this data to our api and store it
            axios
              .post("/athlete-credentials", response_data, {})
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error("Error while posting tokens");
                console.log(error);
              });
          })
          .catch((error) => {
            console.error("Error while posting for authorization code");
            console.log(error);
          });
      }
    }
  }, []); // empty list to ensure code is only executed on initial loading of the page

  function onClickHandler(e) {
    // redirect to Strava oAuth
    window.location.href = authUrl;
  }

  return (
    <React.Fragment>
      {credentialsAuthorized && (
        <Redirect
          to={{
            pathname: "/create-plan",
            state: { accessToken: accessToken },
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
          <img src={talaria_logo_circle} className={classes.logo} />
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
              onClick={onClickHandler}
            />
          ) : (
            <Button
              variant="outlined"
              size="small"
              color="primary"
            >
              Log Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import * as strings from "../strings";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Talaria
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random?marathon,running)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailError, setEmailError] = useState({ error: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    error: false,
    message: "",
  });
  const [credentialsError, setCredentialsError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [authUrl, setAuthUrl] = useState(null);

  function validateEmail() {
    // ensure an email is entered
    if (email === null || email === "") {
      setEmailError({
        ...emailError,
        error: true,
        message: strings.NullEmail,
      });
      return false;
    }

    // ensure a valid email address is entered (string@string.string)
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(emailRegex)) {
      setEmailError({
        ...emailError,
        error: true,
        message: strings.InvalidEmail,
      });
      return false;
    }

    // the email is valid, so reset the error state
    setEmailError({
      ...emailError,
      error: false,
      message: "",
    });
    return true;
  }

  function validatePassword() {
    // ensure a password is entered
    if (password === null || password === "") {
      setPasswordError({
        ...passwordError,
        error: true,
        message: strings.NullPassword,
      });
      return false;
    }

    // ensure a valid password is entered (7-15 characters with 1 number and 1 special character)
    const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!password.match(passwordRegex)) {
      setPasswordError({
        ...passwordError,
        error: true,
        message: strings.InvalidPassword,
      });
      return false;
    }

    // the password is valid, so reset error state
    setPasswordError({
      ...passwordError,
      error: false,
      message: "",
    });
    return true;
  }

  function onClickHandler(e) {
    // var validPassword = validatePassword();
    // var validEmail = validateEmail();

    // if (validEmail && validPassword) {
    //   setCredentialsError(false);
    // } else {
    //   setCredentialsError(true);
    // }

    setAuthUrl('https://www.strava.com/oauth/authorize?client_id=52053&redirect_uri=http://localhost:3000&response_type=code&scope=activity:read_all')
    // axios
    //   .get(auth, {})
    //   .then((response) => {
    //     console.log(response.config["url"]);
    //     setAuthUrl(response.config["url"])
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  function emailOnChangeHandler(e) {
    setEmail(e.target.value);
  }

  function passwordOnChangeHandler(e) {
    setPassword(e.target.value);
  }

  function onPasswordClick() {
    if (passwordVisible) {
      setPasswordVisible(false);
    } else {
      setPasswordVisible(true);
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              spellCheck="false"
              onChange={emailOnChangeHandler}
              error={emailError.error && true}
              helperText={emailError.error && emailError.message}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={passwordVisible ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              spellCheck="false"
              onChange={passwordOnChangeHandler}
              error={passwordError.error && true}
              helperText={passwordError.error && passwordError.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    {passwordVisible ? (
                      <VisibilityIcon
                        color="disabled"
                        onClick={onPasswordClick}
                      />
                    ) : (
                      <VisibilityOffIcon
                        color="disabled"
                        onClick={onPasswordClick}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            {credentialsError && (
              <Alert severity="error">{strings.InvalidCredentials}</Alert>
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onClickHandler}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>

      {credentialsError === false && (
        <Redirect
          to={{
            pathname: 'https://www.strava.com/oauth/authorize?client_id=52053&redirect_uri=http://localhost:3000&response_type=code&scope=activity:read_all',
          }}
        />
      )}

      {authUrl && (
        window.location = authUrl
      )}
    </Grid>
  );
}

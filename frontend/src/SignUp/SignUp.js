import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import * as strings from "../assets/strings/strings";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import Copyright from "../assets/js/Copyright";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: theme.spacing(30),
    marginLeft: theme.spacing(30),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  const [accountCreated, setAccountCreated] = useState(false);

  const [personalDetailsError, setPersonalDetailsError] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [reenterPassword, setReenterPassword] = useState(null);

  const [stravaDetailsError, setStravaDetailsError] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [firstNameError, setFirstNameError] = useState({
    error: false,
    message: "",
  });
  const [lastNameError, setLastNameError] = useState({
    error: false,
    message: "",
  });
  const [emailError, setEmailError] = useState({ error: false, message: "" });
  const [passwordError, setPasswordError] = useState({
    error: false,
    message: "",
  });
  const [reenterPasswordError, setReenterPasswordError] = useState({
    error: false,
    message: "",
  });
  const [clientIdError, setClientIdError] = useState({
    error: false,
    message: "",
  });
  const [clientSecretError, setClientSecretError] = useState({
    error: false,
    message: "",
  });
  const [refreshTokenError, setRefreshTokenError] = useState({
    error: false,
    message: "",
  });

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

  function validateReenterPassword() {
    // ensure a second password is entered
    if (reenterPassword === null || reenterPassword === "") {
      setReenterPasswordError({
        ...reenterPasswordError,
        error: true,
        message: strings.NullReenterPassword,
      });
      return false;
    }

    // ensure a both entered passwords match
    if (password !== reenterPassword) {
      setReenterPasswordError({
        ...reenterPassword,
        error: true,
        message: strings.InvalidReenterPassword,
      });
      return false;
    }

    // the password is valid, so reset error state
    setReenterPasswordError({
      ...passwordError,
      error: false,
      message: "",
    });
    return true;
  }

  function validateFirstName() {
    // ensure a first name is entered
    if (firstName === null || firstName === "") {
      setFirstNameError({
        ...firstNameError,
        error: true,
        message: strings.NullFirstName,
      });
      return false;
    }

    // ensure a valid first name is entered (1-50 characters)
    const firstNameRegex = /^[A-Za-z '-]{1,50}$/;
    if (!firstName.match(firstNameRegex)) {
      setFirstNameError({
        ...firstNameError,
        error: true,
        message: strings.InvalidFirstName,
      });
      return false;
    }

    // the first name is valid, so reset error state
    setFirstNameError({
      ...firstNameError,
      error: false,
      message: "",
    });
    return true;
  }

  function validateLastName() {
    // ensure a last name is entered
    if (lastName === null || lastName === "") {
      setLastNameError({
        ...lastNameError,
        error: true,
        message: strings.NullLastName,
      });
      return false;
    }

    // ensure a valid last name is entered (1-50 characters and - or ')
    const lastNameRegex = /^[A-Za-z '-]{1,50}$/;
    if (!lastName.match(lastNameRegex)) {
      setLastNameError({
        ...lastNameError,
        error: true,
        message: strings.InvalidLastName,
      });
      return false;
    }

    // the last name is valid, so reset error state
    setLastNameError({
      ...lastNameError,
      error: false,
      message: "",
    });
    return true;
  }

  function validateClientId() {
    // ensure a client id is entered
    if (clientId === null || clientId === "") {
      setClientIdError({
        ...clientIdError,
        error: true,
        message: strings.NullClientId,
      });
      return false;
    }

    // ensure a valid client id is entered (numbers)
    const clientIdRegex = /^[0-9]+$/;
    if (!clientId.match(clientIdRegex)) {
      setClientIdError({
        ...clientIdError,
        error: true,
        message: strings.InvalidClientId,
      });
      return false;
    }

    // the client id is valid, so reset error state
    setClientIdError({
      ...clientIdError,
      error: false,
      message: "",
    });
    return true;
  }

  function validateClientSecret() {
    // ensure a client secret is entered
    if (clientSecret === null || clientSecret === "") {
      setClientSecretError({
        ...clientSecretError,
        error: true,
        message: strings.NullClientSecret,
      });
      return false;
    }

    // the client secret is valid, so reset error state
    setClientSecretError({
      ...clientSecretError,
      error: false,
      message: "",
    });
    return true;
  }

  function validateRefreshToken() {
    // ensure a refresh token is entered
    if (refreshToken === null || refreshToken === "") {
      setRefreshTokenError({
        ...refreshTokenError,
        error: true,
        message: strings.NullRefreshToken,
      });
      return false;
    }

    // the refrsh token is valid, so reset error state
    setRefreshTokenError({
      ...refreshTokenError,
      error: false,
      message: "",
    });
    return true;
  }

  function onChangeFirstName(e) {
    setFirstName(e.target.value);
  }

  function onChangeLastName(e) {
    setLastName(e.target.value);
  }

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  function onChangeReenterPassword(e) {
    setReenterPassword(e.target.value);
  }

  function onChangeClientId(e) {
    setClientId(e.target.value);
  }

  function onChangeClientSecret(e) {
    setClientSecret(e.target.value);
  }

  function onChangeRefreshToken(e) {
    setRefreshToken(e.target.value);
  }

  function handlePersonalNext() {
    var validEmail = validateEmail();
    var validPassword = validatePassword();
    var validReenterPassword = validateReenterPassword();
    var validFirstName = validateFirstName();
    var validLastName = validateLastName();

    if (
      validEmail &&
      validPassword &&
      validReenterPassword &&
      validFirstName &&
      validLastName
    ) {
      setPersonalDetailsError(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setPersonalDetailsError(true);
    }
  }

  function handleStravaNext() {
    var validClientId = validateClientId();
    var validClientSecret = validateClientSecret();
    var validRefreshToken = validateRefreshToken();

    if (validClientId && validClientSecret && validRefreshToken) {
      setStravaDetailsError(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setStravaDetailsError(true);
    }
  }

  function handleCreateAccount() {
    if (!personalDetailsError && !stravaDetailsError) {
      // axios
      //   .get(`/email`, {
      //     params: {
      //       email: email,
      //       name: firstName,
      //     },
      //   })
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((error) => {
      //     console.log("Error while sending email");
      //     console.log(error);
      //   });
      setAccountCreated(true);
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container component="main" maxWidth="s">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div className={classes.root}>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel error={personalDetailsError && true}>
                Distance
              </StepLabel>
              <StepContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      onChange={onChangeFirstName}
                      autoFocus
                      value={firstName}
                      error={firstNameError.error && true}
                      helperText={
                        firstNameError.error && firstNameError.message
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      onChange={onChangeLastName}
                      value={lastName}
                      error={lastNameError.error && true}
                      helperText={lastNameError.error && lastNameError.message}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      onChange={onChangeEmail}
                      value={email}
                      error={emailError.error && true}
                      helperText={emailError.error && emailError.message}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      value={password}
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={onChangePassword}
                      error={passwordError.error && true}
                      helperText={passwordError.error && passwordError.message}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      value={reenterPassword}
                      name="reenterp-assword"
                      label="Reenter Password"
                      type="password"
                      id="reenter-password"
                      autoComplete="current-password"
                      onChange={onChangeReenterPassword}
                      error={reenterPasswordError.error && true}
                      helperText={
                        reenterPasswordError.error &&
                        reenterPasswordError.message
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-end">
                  <Button
                    disabled
                    onClick={handleBack}
                    className={classes.button}
                    size="small"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePersonalNext}
                    className={classes.button}
                    size="small"
                  >
                    Next
                  </Button>
                </Grid>
                <br></br>
              </StepContent>
            </Step>

            <Step>
              <StepLabel error={stravaDetailsError && true}>
                Goal Type
              </StepLabel>
              <StepContent>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="strava-help"
                  >
                    <Typography className={classes.heading}>
                      What are these values and how do I get them?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption">
                      We need the following values to allow us to connect to
                      your Strava and get all the necessary data about your
                      runs. You can get them by following this{" "}
                      <Link
                        href="https://www.youtube.com/watch?v=sgscChKfGyg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        tutorial
                      </Link>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <br></br>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="client-id"
                      label="Client ID"
                      name="client-id"
                      onChange={onChangeClientId}
                      error={clientIdError.error && true}
                      helperText={clientIdError.error && clientIdError.message}
                      value={clientId}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="client-secret"
                      label="Client Secret"
                      name="client-secret"
                      onChange={onChangeClientSecret}
                      error={clientSecretError.error && true}
                      helperText={
                        clientSecretError.error && clientSecretError.message
                      }
                      value={clientSecret}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="refresh-token"
                      label="Refresh Token"
                      name="refresh-token"
                      onChange={onChangeRefreshToken}
                      error={refreshTokenError.error && true}
                      helperText={
                        refreshTokenError.error && refreshTokenError.message
                      }
                      value={refreshToken}
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid container justify="flex-end">
                  <Button
                    onClick={handleBack}
                    className={classes.button}
                    size="small"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStravaNext}
                    className={classes.button}
                    size="small"
                  >
                    Next
                  </Button>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Runs Per Week</StepLabel>
              <StepContent>
                <Typography variant="caption">
                  Name: {firstName} {lastName}
                  <br></br>
                  Email: {email}
                  <br></br>
                  Client ID: {clientId}
                  <br></br>
                  Client Secret: {clientSecret}
                  <br></br>
                  Refresh Token: {refreshToken}
                </Typography>

                <Grid container justify="flex-end">
                  <Button
                    onClick={handleBack}
                    className={classes.button}
                    size="small"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateAccount}
                    className={classes.button}
                    size="small"
                  >
                    Create Account
                  </Button>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel error={stravaDetailsError && true}>
                Goal Date
              </StepLabel>
            </Step>
            <Box mt={5}>
              <Copyright />
            </Box>
          </Stepper>
        </div>
      </div>
    </Container>
  );
}

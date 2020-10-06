import React, { useState, useEffect, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import { CreatePlanContext } from "../CreatePlanContext";
import * as strings from "../../assets/strings/strings";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  info: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const days = [
  "---",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PreferencesForm() {
  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);

  const [stateDays, setStateDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [blockedError, setBlockedError] = useState({
    error: false,
    message: "",
  });
  const [longRunError, setLongRunError] = useState(false);
  const [numDaysBlocked, setNumDaysBlocked] = useState(0);

  const handleCheckboxChange = (event) => {
    if (!event.target.checked) {
      setStateDays({ ...stateDays, [event.target.name]: event.target.checked });
      setBlockedError({ ...blockedError, error: false, message: "" });
    } else {
      if (state.runsPerWeek === "2-3" && numDaysBlocked === 4) {
        setBlockedError({
          ...blockedError,
          error: true,
          message: strings.BlockedDaysLimitError,
        });
      } else if (state.runsPerWeek === "4-5" && numDaysBlocked === 2) {
        setBlockedError({
          ...blockedError,
          error: true,
          message: strings.BlockedDaysLimitError,
        });
      } else if (state.runsPerWeek === "6+" && numDaysBlocked === 1) {
        setBlockedError({
          ...blockedError,
          error: true,
          message: strings.BlockedDaysLimitError,
        });
      } else if (state.longRunDay === event.target.name) {
        setBlockedError({
          ...blockedError,
          error: true,
          message: strings.LongRunBlockedError,
        });
      } else {
        setStateDays({
          ...stateDays,
          [event.target.name]: event.target.checked,
        });
      }
    }
  };

  const handleSelectChange = (event) => {
    const daySelected = event.target.value;
    if (state.blockedDays.includes(daySelected)) {
      setLongRunError(true);
    } else if (event.target.value === "---") {
      setState({ ...state, longRunDay: null });
      setLongRunError(false);
    } else {
      setState({ ...state, longRunDay: daySelected });
      setLongRunError(false);
    }
  };

  useEffect(() => {
    const blockedDays = [];
    if (stateDays.Monday) {
      blockedDays.push("Monday");
    }
    if (stateDays.Tuesday) {
      blockedDays.push("Tuesday");
    }
    if (stateDays.Wednesday) {
      blockedDays.push("Wednesday");
    }
    if (stateDays.Thursday) {
      blockedDays.push("Thursday");
    }
    if (stateDays.Friday) {
      blockedDays.push("Friday");
    }
    if (stateDays.Saturday) {
      blockedDays.push("Saturday");
    }
    if (stateDays.Sunday) {
      blockedDays.push("Sunday");
    }

    setNumDaysBlocked(blockedDays.length);
    setBlockedError({ ...blockedError, error: false, message: "" });
    setState({ ...state, blockedDays: blockedDays });
  }, [stateDays]);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        <Alert severity="info" className={classes.info}>
          All of the following questions are optional, to help provide a more
          customised plan
        </Alert>
        {blockedError.error && (
          <Alert severity="error" className={classes.info}>
            {blockedError.message}
          </Alert>
        )}
        <Typography className={classes.info}>
          Is there any particular days you'd not like to run on during the plan?
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Monday}
                onChange={handleCheckboxChange}
                name="Monday"
              />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Tuesday}
                onChange={handleCheckboxChange}
                name="Tuesday"
              />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Wednesday}
                onChange={handleCheckboxChange}
                name="Wednesday"
              />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Thursday}
                onChange={handleCheckboxChange}
                name="Thursday"
              />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Friday}
                onChange={handleCheckboxChange}
                name="Friday"
              />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Saturday}
                onChange={handleCheckboxChange}
                name="Saturday"
              />
            }
            label="Saturday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Sunday}
                onChange={handleCheckboxChange}
                name="Sunday"
              />
            }
            label="Sunday"
          />
        </FormGroup>
        {state.distance.includes("MARATHON") && (
          <>
            {longRunError && (
              <Alert severity="error" className={classes.info}>
                {strings.LongRunBlockedError}
              </Alert>
            )}
            <Typography className={classes.info}>
              Is there a particular day you'd like to do your long run?
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel>Long Run Day</InputLabel>
              <Select
                placeholder="None"
                value={state.longRunDay}
                onChange={handleSelectChange}
                className={classes.input}
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        <Typography className={classes.info}>
          Would you like to include a taper towards the end of your plan?
        </Typography>
        <Switch
          checked={state.includeTaper}
          onChange={(event) =>
            setState({ ...state, includeTaper: !state.includeTaper })
          }
          name="include-taper"
          className={classes.input}
        />
        <Typography className={classes.info}>
          Would you like to include cross training activities to your plan?
        </Typography>
        <Switch
          checked={state.includeCrossTrain}
          onChange={() =>
            setState({ ...state, includeCrossTrain: !state.includeCrossTrain })
          }
          name="include-cross-train"
          className={classes.input}
        />
      </Grid>
    </React.Fragment>
  );
}

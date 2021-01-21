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
import * as strings from "../../assets/utils/strings";
import * as enums from "../../assets/utils/enums";
import TextField from "@material-ui/core/TextField";

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
  // This is the last form in the CreatePlan flow, it allows the user to optionally select a range of 
  // preferences for their plan

  const classes = useStyles();

  const [state, setState] = useContext(CreatePlanContext);
  const [stateDays, setStateDays] = useState({
    Monday: state.blockedDays.includes(enums.Day.MONDAY) ? true : false,
    Tuesday: state.blockedDays.includes(enums.Day.TUESDAY) ? true : false,
    Wednesday: state.blockedDays.includes(enums.Day.WEDNESDAY) ? true : false,
    Thursday: state.blockedDays.includes(enums.Day.THURSDAY) ? true : false,
    Friday: state.blockedDays.includes(enums.Day.FRIDAY) ? true : false,
    Saturday: state.blockedDays.includes(enums.Day.SATURDAY) ? true : false,
    Sunday: state.blockedDays.includes(enums.Day.SUNDAY) ? true : false,
  });
  const [blockedError, setBlockedError] = useState({
    error: false,
    message: "",
  });
  const [longRunError, setLongRunError] = useState(false);
  const [numDaysBlocked, setNumDaysBlocked] = useState(0);

  const handleCheckboxChange = (event) => {
    if (!event.target.checked) {
      // if the event is unticking a checkbox, we set this day to false and clear errors
      setStateDays({ ...stateDays, [event.target.name]: event.target.checked });
      setBlockedError({ ...blockedError, error: false, message: "" });
    } else {
      // dependant on the runs per week provided previously, only a certain number of days are blockable
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
        // we can't set a day as blocked but also select it as the long run day
        setBlockedError({
          ...blockedError,
          error: true,
          message: strings.LongRunBlockedError,
        });
      } else {
        // else it's a valid selection of a day, so set it as checked
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
      // we can't set a day as our long run if it's currently being blocked
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
    // everytime the stateDays is changed, we recalculate the days that are currently being blocked based off the intermediate stateDays
    const blockedDays = [];
    if (stateDays.Monday) {
      blockedDays.push(enums.Day.MONDAY);
    }
    if (stateDays.Tuesday) {
      blockedDays.push(enums.Day.TUESDAY);
    }
    if (stateDays.Wednesday) {
      blockedDays.push(enums.Day.WEDNESDAY);
    }
    if (stateDays.Thursday) {
      blockedDays.push(enums.Day.THURSDAY);
    }
    if (stateDays.Friday) {
      blockedDays.push(enums.Day.FRIDAY);
    }
    if (stateDays.Saturday) {
      blockedDays.push(enums.Day.SATURDAY);
    }
    if (stateDays.Sunday) {
      blockedDays.push(enums.Day.SUNDAY);
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
          Please provide a name for your new training plan:
        </Typography>
        <TextField
          label="Plan Name"
          className={classes.input}
          value={state.planName}
          onChange={(e) => setState({ ...state, planName: e.target.value })}
        />
        <Typography className={classes.info}>
          Is there any particular days you'd not like to run on during the plan?
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Monday}
                onChange={handleCheckboxChange}
                name={enums.Day.MONDAY}
              />
            }
            label={enums.Day.MONDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Tuesday}
                onChange={handleCheckboxChange}
                name={enums.Day.TUESDAY}
              />
            }
            label={enums.Day.TUESDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Wednesday}
                onChange={handleCheckboxChange}
                name={enums.Day.WEDNESDAY}
              />
            }
            label={enums.Day.WEDNESDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.THURSDAY}
                onChange={handleCheckboxChange}
                name={enums.Day.THURSDAY}
              />
            }
            label={enums.Day.THURSDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Friday}
                onChange={handleCheckboxChange}
                name={enums.Day.FRIDAY}
              />
            }
            label={enums.Day.FRIDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Saturday}
                onChange={handleCheckboxChange}
                name={enums.Day.SATURDAY}
              />
            }
            label={enums.Day.SATURDAY}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Sunday}
                onChange={handleCheckboxChange}
                name={enums.Day.SUNDAY}
              />
            }
            label={enums.Day.SUNDAY}
          />
        </FormGroup>
        {/* The long run question is only asked if a distance of Half-Marathon or Marathon were previously selected */}
        {state.distance.includes(enums.Distance.MARATHON) && (
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
          Would you like to include cross training activities in your plan?
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

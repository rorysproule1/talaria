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
import { CreatePlanContext } from "./CreatePlanContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  info: {
    marginBottom: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const days = [
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

  const handleChange = (event) => {
    setStateDays({ ...stateDays, [event.target.name]: event.target.checked });
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

    setState({ ...state, blockedDays: blockedDays });
  }, [stateDays]);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        <Alert severity="info" className={classes.info}>
          All of the following questions are optional, to help provide a more
          customised plan
        </Alert>

        {state.distance === "MARATHON" ||
          (state.distance === "HALF-MARATHON" && (
            <>
              <Typography>
                Is there a particular day you'd like to do your long run?
              </Typography>
              <FormControl className={classes.formControl}>
                <InputLabel>Long Run Day</InputLabel>
                <Select
                  placeholder="None"
                  value={state.longRunDay}
                  onChange={(event) =>
                    setState({ ...state, longRunDay: event.target.value })
                  }
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
          ))}

        <Typography>
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
        <Typography>
          Would you like to include cross training activities to your plan?
        </Typography>
        <Switch
          checked={state.includeCrossTrain}
          onChange={(event) =>
            setState({ ...state, includeCrossTrain: !state.includeCrossTrain })
          }
          name="include-cross-train"
          className={classes.input}
        />
        <Typography>
          Is there any particular days you'd not like to run on during the plan?
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Monday}
                onChange={handleChange}
                name="Monday"
              />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Tuesday}
                onChange={handleChange}
                name="Tuesday"
              />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Wednesday}
                onChange={handleChange}
                name="Wednesday"
              />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Thursday}
                onChange={handleChange}
                name="Thursday"
              />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Friday}
                onChange={handleChange}
                name="Friday"
              />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Saturday}
                onChange={handleChange}
                name="Saturday"
              />
            }
            label="Saturday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stateDays.Sunday}
                onChange={handleChange}
                name="Sunday"
              />
            }
            label="Sunday"
          />
        </FormGroup>
      </Grid>
    </React.Fragment>
  );
}

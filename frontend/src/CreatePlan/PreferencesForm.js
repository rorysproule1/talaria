import React, { useState, useEffect } from "react";
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
import { TimePicker } from 'antd';

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

  const [includeTaper, setIncludeTaper] = useState(false);
  const [includeCrossTrain, setIncludeCrossTrain] = useState(false);
  const [longRunDay, setLongRunDay] = useState();
  const [blockedDays, setBlockedDays] = useState([]);
  const [state, setState] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    console.log(state);
  }, [state]); // empty list to ensure code is only executed on initial loading of the page

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        <TimePicker
          // onChange={onChange}
          // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
        />
        ,
        <Alert severity="info" className={classes.info}>
          All of the following questions are optional, to help provide a more
          customised plan
        </Alert>
        {/* should only show this question is halfmarathon or marathon are selected */}
        <Typography>
          Is there a particular day you'd like to do your long run?
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel>Long Run Day</InputLabel>
          <Select
            placeholder="None"
            value={longRunDay}
            onChange={(event) => setLongRunDay(event.target.value)}
            className={classes.input}
          >
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography>
          Would you like to include a taper towards the end of your plan?
        </Typography>
        <Switch
          checked={includeCrossTrain}
          onChange={(e) => setIncludeCrossTrain(!includeCrossTrain)}
          name="include-taper"
          className={classes.input}
        />
        <Typography>
          Would you like to include cross training activities to your plan?
        </Typography>
        <Switch
          checked={includeTaper}
          onChange={(e) => setIncludeTaper(!includeTaper)}
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
                checked={state.Monday}
                onChange={handleChange}
                name="Monday"
              />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Tuesday}
                onChange={handleChange}
                name="Tuesday"
              />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Wednesday}
                onChange={handleChange}
                name="Wednesday"
              />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Thursday}
                onChange={handleChange}
                name="Thursday"
              />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Friday}
                onChange={handleChange}
                name="Friday"
              />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Saturday}
                onChange={handleChange}
                name="Saturday"
              />
            }
            label="Saturday"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.Sunday}
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

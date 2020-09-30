import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

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

export default function Preferences() {
  const classes = useStyles();

  const [includeTaper, setIncludeTaper] = useState(false);
  const [includeCrossTrain, setIncludeCrossTrain] = useState(false);
  const [longRunDay, setLongRunDay] = useState();
  const [blockedDays, setBlockedDays] = useState([]);

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setLongRunDay(event.target.value);
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        <Alert severity="info" className={classes.info}>
          All of the following questions are optional, to help provide a more customised plan
        </Alert>
        {/* <Typography>
          How many runs would you like your plan to include per week?
        </Typography> */}
        {/* <RadioGroup value={runsPerWeek} onChange={(event) => setRunsPerWeek(parseInt(event.target.value))}>
          <FormControlLabel value={2} control={<Radio />} label="2-3" />
          <FormControlLabel value={4} control={<Radio />} label="4-6" />
          <FormControlLabel value={6} control={<Radio />} label="6+" />
        </RadioGroup> */}

        <Typography>
          Is there a particular day you'd like to do your long run?
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel>Long Run Day</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            onChange={handleChange}
          >
            {days.map((day) => (
              <MenuItem value={day}>{day}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </React.Fragment>
  );
}

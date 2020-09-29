import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "16px",
    marginTop: theme.spacing(1),
  },
  date: {
    marginLeft: theme.spacing(1),
  },
  info: {
    marginTop: theme.spacing(2),
  },
}));

export default function RunsPerWeekForm() {
  const classes = useStyles();

  const [endDate, setEndDate] = useState();
  const [planDuration, setPlanDuration] = useState();

  return (
    <React.Fragment>
      <Grid item xs={16} sm={8} md={8}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            How many runs would you like to do on a weekly basis?
          </FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            // value={value}
            // onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="2-3 runs per week"
            />
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="4-5 runs per week"
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label="6+ runs per week"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </React.Fragment>
  );
}

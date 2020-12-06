import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import { CreatePlanContext } from "../CreatePlanContext";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import * as strings from "../../assets/utils/strings";

const useStyles = makeStyles((theme) => ({
  error: {
    marginBottom: theme.spacing(1),
  },
}));

export default function RunsPerWeekForm() {
  // This is the fourth form in the CreatePlan flow, it allows the user to select an amount of runs
  // per week for their plan and suggests to them if they should go for distance 
  // or time (also what time to go for)

  const classes = useStyles();
  const [state, setState] = useContext(CreatePlanContext);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        {state.runsPerWeekError && (
          <Alert severity="error" className={classes.error}>
            {strings.RunsPerWeekError}
          </Alert>
        )}
        <Typography>
          How many runs would you like your plan to include per week?
        </Typography>

        <RadioGroup
          value={state.runsPerWeek}
          onChange={(event) =>
            setState({ ...state, runsPerWeek: event.target.value })
          }
        >
          <FormControlLabel value={"2-3"} control={<Radio />} label="2-3" />
          <FormControlLabel value={"4-5"} control={<Radio />} label="4-5" />
          <FormControlLabel value={"6+"} control={<Radio />} label="6+" />
        </RadioGroup>
      </Grid>
    </React.Fragment>
  );
}

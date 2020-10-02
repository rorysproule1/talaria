import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import { CreatePlanContext } from "./CreatePlanContext";

export default function RunsPerWeekForm() {
  const [state, setState] = useContext(CreatePlanContext);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
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
          <FormControlLabel value={"4-6"} control={<Radio />} label="4-6" />
          <FormControlLabel value={"6+"} control={<Radio />} label="6+" />
        </RadioGroup>
      </Grid>
    </React.Fragment>
  );
}

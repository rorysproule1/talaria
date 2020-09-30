import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

export default function Preferences() {
  const [includeTaper, setIncludeTaper] = useState(false);
  const [includeCrossTrain, setIncludeCrossTrain] = useState(false);
  const [longRunDay, setLongRunDay] = useState();
  const [blockedDays, setBlockedDays] = useState([]);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={8} md={10}>
        <Typography>
          How many runs would you like your plan to include per week?
        </Typography>
        {/* <RadioGroup value={runsPerWeek} onChange={(event) => setRunsPerWeek(parseInt(event.target.value))}>
          <FormControlLabel value={2} control={<Radio />} label="2-3" />
          <FormControlLabel value={4} control={<Radio />} label="4-6" />
          <FormControlLabel value={6} control={<Radio />} label="6+" />
        </RadioGroup> */}
      </Grid>
    </React.Fragment>
  );
}

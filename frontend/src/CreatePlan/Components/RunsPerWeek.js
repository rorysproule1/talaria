import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import { CreatePlanContext } from "../CreatePlanContext";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { colors } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  error: {
    marginBottom: theme.spacing(1),
  },
  info: {
    padding: "16px",
    marginBottom: theme.spacing(2),
  },
  root: {
    width: "100%",
  },
  subheading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordian: {
    marginTop: theme.spacing(1),
    backgroundColor: "white",
    boxShadow: "none",
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
        <Alert severity="info" className={classes.info}>
          Looking at your Strava history, you have been averaging roughly{" "}
          {state.avgRunsPerWeek} runs per week over the last 6 weeks.
        </Alert>

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

        <Accordion className={classes.accordian}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              What is my runs per week and why is it important?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={classes.subheading}>
              Your number of runs per week have a large impact on the chances of
              you successfully completing your training plan. <p></p> This is
              due to the fact that if you sharply increase the number of runs
              you are carrying out each week, you have a greater chance of
              suffering from injury, or mentally fatiguing. For these reasons we
              advise you stick to the pre-selected runs per week value. <p></p>
              This value is calculated by looking at the volume of runs you've
              carried out over the last 6 weeks, as including runs from before
              this timeframe will not provide an accurate account of your
              current fitness level. However if you believe the value to be
              incorrect please continue with caution.<p></p> If you select a
              runs per week value lower than the pre-selected one, keep in mind
              that this will increase the length of the plan and may cause an
              issue if you have selected a finish date that isn't too far in the
              future.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </React.Fragment>
  );
}

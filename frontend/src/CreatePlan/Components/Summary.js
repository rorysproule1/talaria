import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { CreatePlanContext } from "../CreatePlanContext";
import Alert from "@material-ui/lab/Alert";
import { Typography } from "@material-ui/core";
import * as enums from "../../assets/utils/enums";

const useStyles = makeStyles((theme) => ({
  capitalize: {
    textTransform: "capitalize",
  },
  info: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

export default function Summary() {
  const classes = useStyles();
  const [state, setState] = useContext(CreatePlanContext);

  return (
    <React.Fragment>
      {state.planSubmitted && (
        <Alert severity="success" className={classes.info}>
          SUCCESS: Your plan was created successfully!
        </Alert>
      )}
      {state.planSubmittedError && (
        <Alert severity="error" className={classes.info}>
          ERROR: There was a problem creating your plan
        </Alert>
      )}
      <Table size="small">
        <Typography className={classes.info}>
          Please review your plan details:
        </Typography>
        <TableBody>
          <TableRow>
            <TableCell>Distance:</TableCell>
            <TableCell className={classes.capitalize}>
              {state.distance.toLowerCase()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Goal Type:</TableCell>
            <TableCell className={classes.capitalize}>
              {state.goalType.toLowerCase()}
            </TableCell>
          </TableRow>
          {state.goalType === enums.GoalType.TIME && (
            <TableRow>
              <TableCell>Goal Time:</TableCell>
              <TableCell>{state.goalTime}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Finish Date:</TableCell>
            <TableCell>
              {state.finishDate
                ? state.finishDate
                    .toString()
                    .substring(
                      0,
                      state.finishDate.toString().indexOf("00:00:00")
                    )
                : "Not set"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Runs Per Week:</TableCell>
            <TableCell>{state.runsPerWeek}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Blocked Days:</TableCell>
            <TableCell>
              {state.blockedDays.length > 1
                ? state.blockedDays.join(", ")
                : state.blockedDays.length === 1
                ? state.blockedDays
                : "N/A"}
            </TableCell>
          </TableRow>
          {state.distance.includes(enums.Distance.MARATHON) && (
            <TableRow>
              <TableCell>Long Run Day:</TableCell>
              <TableCell>
                {state.longRunDay ? state.longRunDay : "N/A"}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Include Taper:</TableCell>
            <TableCell>{state.includeTaper ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Include Cross Training:</TableCell>
            <TableCell>{state.includeCrossTrain ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plan Name</TableCell>
            <TableCell>{state.planName ? state.planName : "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

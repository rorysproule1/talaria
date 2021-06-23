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
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import * as urls from "../../assets/utils/urls";

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
  // This component is used to provide the runner with a summary of the plan they have
  // attempted to create in the CreatePlan flow. They can review this and go back to make
  // changes, or confirm that they want to create the plan

  const classes = useStyles();
  const [state, setState] = useContext(CreatePlanContext);

  function onChangeHandler(changeStep) {
    setState({ ...state, step: changeStep });
  }

  return (
    <React.Fragment>
      {state.planSubmitted && (
        <Alert severity="success" className={classes.info}>
          SUCCESS: Your plan was created successfully! Click{" "}
          <Link href={urls.ViewPlan}>here</Link> to view it.
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
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(0)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Goal Type:</TableCell>
            <TableCell className={classes.capitalize}>
              {state.goalType.toLowerCase()}
            </TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(1)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          {state.goalType === enums.GoalType.TIME && (
            <TableRow>
              <TableCell>Goal Time:</TableCell>
              <TableCell>{state.goalTime}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  color="primary"
                  className={classes.button}
                  onClick={(e) => onChangeHandler(1)}
                >
                  Change
                </Button>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Start Date:</TableCell>
            <TableCell>
              {state.startDate
                .toString()
                .substring(0, state.startDate.toString().indexOf("GMT") - 9)}
            </TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(2)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
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
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(2)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Runs Per Week:</TableCell>
            <TableCell>{state.runsPerWeek}</TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(3)}
              >
                Change
              </Button>
            </TableCell>
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
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(4)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          {state.distance.includes(enums.Distance.MARATHON) && (
            <TableRow>
              <TableCell>Long Run Day:</TableCell>
              <TableCell>
                {state.longRunDay ? state.longRunDay : "N/A"}
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  color="primary"
                  className={classes.button}
                  onClick={(e) => onChangeHandler(4)}
                >
                  Change
                </Button>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Include Taper:</TableCell>
            <TableCell>{state.includeTaper ? "Yes" : "No"}</TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(4)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Include Cross Training:</TableCell>
            <TableCell>{state.includeCrossTrain ? "Yes" : "No"}</TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(4)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plan Name</TableCell>
            <TableCell>{state.planName ? state.planName : "N/A"}</TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                className={classes.button}
                onClick={(e) => onChangeHandler(4)}
              >
                Change
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

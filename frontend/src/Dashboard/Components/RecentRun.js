import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { DashboardContext } from "../DashboardContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  loading: {
    margin: "0 auto",
    marginTop: theme.spacing(5),
  },
}));

export default function RecentRun() {
  // This component provides the runner with details about their last Strava activity on their Dashboard, using the
  // Strava data requested in Dashboard.js

  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      <Title>Latest Run</Title>
      {state.dashboardError ? (
        <Typography color="textSecondary">
          There was an error getting your latest run from Strava
        </Typography>
      ) : state.recentRun ? (
        <>
          <Typography component="p" variant="h4">
            {state.recentRun["title"]}
          </Typography>
          <Typography color="textSecondary">
            on {state.recentRun["date"].substring(0, state.recentRun["date"].length - 7)}
          </Typography>
          <Divider style={{ marginTop: "8px" }} />
          <List>
            <ListItem>
              <ListItemText
                primary={state.recentRun["distance"] + "KM"}
                secondary="Distance"
              />
              <ListItemText
                primary={state.recentRun["time"]}
                secondary="Time"
              />
              <ListItemText
                primary={state.recentRun["speed"] + "/KM"}
                secondary="Pace"
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      ) : (
        <CircularProgress color="secondary" className={classes.loading} />
      )}
    </React.Fragment>
  );
}

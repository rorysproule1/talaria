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
  }
}));

export default function RecentRun() {
  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      <Title>Latest Run</Title>
      {state.recentRun ? (
        <>
          <Typography component="p" variant="h4">
            {state.recentRun["title"]}
          </Typography>
          <Typography color="textSecondary">
            on {state.recentRun["date"]}
          </Typography>
          <Divider style={{ marginTop: "8px" }} />
          <List>
            <ListItem>
              <ListItemText
                primary={state.recentRun["distance"] + "km"}
                secondary="Distance"
              />
              <ListItemText
                primary={state.recentRun["time"]}
                secondary="Time"
              />
              <ListItemText
                primary={state.recentRun["speed"] + "/km"}
                secondary="Pace"
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      ) : (
        <CircularProgress color="secondary" className={classes.loading}/>
      )}
    </React.Fragment>
  );
}

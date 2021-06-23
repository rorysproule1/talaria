import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { DashboardContext } from "../DashboardContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  loading: {
    margin: "0 auto",
    marginTop: theme.spacing(5),
  },
}));

export default function LastWeek() {
  // This component provides the runner with details about their Strava activity in the list 7 days on their Dashboard, using the
  // Strava data requested in Dashboard.js

  const classes = useStyles();
  const [state, setState] = useContext(DashboardContext);

  return (
    <React.Fragment>
      <Title>Your last 7 days ...</Title>
      {state.dashboardError ? (
        <Typography color="textSecondary">
          There was an error getting your last week's running data from Strava
        </Typography>
      ) : state.lastWeek ? (
        <>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={state.lastWeek}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                name="Distance (KM)"
                dataKey="distance"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                name="Time (Mins)"
                dataKey="time"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <CircularProgress color="secondary" className={classes.loading} />
      )}
    </React.Fragment>
  );
}

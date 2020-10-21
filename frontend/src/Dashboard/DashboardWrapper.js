import React from "react";
import { DashboardProvider } from "./DashboardContext";
import Dashboard from "./Components/Dashboard";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";

export default function DashboardWrapper(props) {

  return (
    <React.Fragment>
      {props.location.state ? (
        <DashboardProvider>
          <React.Fragment>
            <Dashboard athleteID={props.location.state.athleteID} />
          </React.Fragment>
        </DashboardProvider>
      ) : (
        <Redirect
          to={{
            pathname: urls.Login,
          }}
        />
      )}
    </React.Fragment>
  );
}
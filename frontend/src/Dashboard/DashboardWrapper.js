import React from "react";
import { DashboardProvider } from "./DashboardContext";
import Dashboard from "./Components/Dashboard";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";

export default function DashboardWrapper(props) {
  // This wrapper authenticates the user (using the user id passed) before rendering the Dashboard,
  // it also provides the components within it access to the DashboardContext
  return (
    <React.Fragment>
      {sessionStorage.athleteID ? (
        <DashboardProvider>
          <React.Fragment>
            <Dashboard />
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

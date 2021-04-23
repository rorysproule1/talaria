import React from "react";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";
import ViewPlan from "./ViewPlan";

export default function ViewPlanWrapper(props) {
  // This wrapper authenticates the user (using the athlete id stored in the session storage) before rendering the View Plan screen,
  return (
    <React.Fragment>
      {sessionStorage.athleteID ? (
        <React.Fragment>
          <ViewPlan />
        </React.Fragment>
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

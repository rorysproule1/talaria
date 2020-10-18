import React from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";

export default function CreatePlanWrapper(props) {
  const athleteID = props.location.state.athleteID;

  return (
    <React.Fragment>
      {athleteID ? (
        <CreatePlanProvider>
          <React.Fragment>
            <CreatePlan athleteID={athleteID} />
          </React.Fragment>
        </CreatePlanProvider>
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

import React from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";

export default function CreatePlanWrapper(props) {
  // This wrapper authenticates the user (using the user id passed) before rendering the CreatePlan form,
  // it also provides the components within it access to the CreatePlanContext

  return (
    <React.Fragment>
      {props.location.state ? (
        <CreatePlanProvider>
          <React.Fragment>
            <CreatePlan athleteID={props.location.state.athleteID} />
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

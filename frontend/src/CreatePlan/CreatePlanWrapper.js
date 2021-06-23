import React from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import * as urls from "../assets/utils/urls";
import { Redirect } from "react-router-dom";

export default function CreatePlanWrapper(props) {
  // This wrapper authenticates the user (using the athlete id stored in the session storage) before rendering the CreatePlan form,
  // it also provides the components within it access to the CreatePlanContext

  return (
    <React.Fragment>
      {sessionStorage.athleteID ? (
        <CreatePlanProvider>
          <React.Fragment>
            <CreatePlan />
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

import React, { useContext } from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import * as urls from "../assets/utils/urls";
import { AppContext } from "..//AppContext";
import { Redirect } from "react-router-dom";

export default function CreatePlanWrapper() {
  const [user, setUser] = useContext(AppContext);

  return (
    <React.Fragment>
      {user.isLoggedIn ? (
        <CreatePlanProvider>
          <React.Fragment>
            <CreatePlan athleteID={user.athleteID} />
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

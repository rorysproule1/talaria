import React from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";

export default function CreatePlanWrapper(props) {
  const athleteID = props.location.state.athleteID;

  return (
    <CreatePlanProvider>
      <React.Fragment>
        <CreatePlan athleteID={athleteID}/>
      </React.Fragment>
    </CreatePlanProvider>
  );
}

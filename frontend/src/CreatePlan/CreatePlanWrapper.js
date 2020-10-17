import React from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import * as urls from "../assets/utils/urls";

export default function CreatePlanWrapper(props) {

  var athleteID
  if (props.location.state === undefined) {
    window.location.href = urls.Login
  } else{
    athleteID = props.location.state.athleteID;
  }

  return (
    <CreatePlanProvider>
      <React.Fragment>
        <CreatePlan athleteID={athleteID}/>
      </React.Fragment>
    </CreatePlanProvider>
  );
}

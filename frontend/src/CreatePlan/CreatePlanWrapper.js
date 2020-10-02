import React, { useEffect } from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./CreatePlan";
import axios from "axios";

export default function CreatePlanWrapper(props) {
  useEffect(() => {
    const accessToken = props.location.state.accessToken;
    axios
      .get(`/strava-insights`, { params: { access_token: accessToken } })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // empty list to ensure code is only executed on initial loading of the page

  return (
    <CreatePlanProvider>
      <React.Fragment>
        <CreatePlan />
      </React.Fragment>
    </CreatePlanProvider>
  );
}

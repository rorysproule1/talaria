import React, { useEffect } from "react";
import { CreatePlanProvider } from "./CreatePlanContext";
import CreatePlan from "./Components/CreatePlan";
import axios from "axios";

export default function CreatePlanWrapper(props) {
  useEffect(() => {
    /*
     On entry to CreatePlan, we get our list of strava insights to be used throughout plan creation to
     provide personalised suggestions
    */

    const accessToken = props.location.state.accessToken;
    axios
      .get(`/strava-insights`, { params: { access_token: accessToken } })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <CreatePlanProvider>
      <React.Fragment>
        <CreatePlan />
      </React.Fragment>
    </CreatePlanProvider>
  );
}

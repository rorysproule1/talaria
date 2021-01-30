import React, { useState, useEffect } from "react";

/* 
  Using the useContext Hook, this is where we provide all of the state variables that are used by multiple components
  in the plan creation flow
*/

const CreatePlanContext = React.createContext([{}, () => {}]);

const CreatePlanProvider = (props) => {
  const [state, setState] = useState({
    step: 0,
    planSubmitted: false,
    planSubmittedError: false,
    // Plan Details
    distance: null,
    goalType: null,
    goalTime: null,
    finishDate: null,
    runsPerWeek: null,
    includeTaper: false,
    includeCrossTrain: false,
    longRunDay: null,
    blockedDays: [],
    runsPerWeekError: false,
    planName: null,
    // Runner Insights
    insightsFound: false,
    completed5km: null,
    completed10km: null,
    completedHalfMarathon: null,
    completedMarathon: null,
    fastest5km: null,
    fastest10km: null,
    fastestHalfMarathon: null,
    fastestMarathon: null,
    additionalActivities: [],
  });

  useEffect(() => {
    // console.log(state)
  }, [state]);

  return (
    <CreatePlanContext.Provider value={[state, setState]}>
      {props.children}
    </CreatePlanContext.Provider>
  );
};

export { CreatePlanContext, CreatePlanProvider };

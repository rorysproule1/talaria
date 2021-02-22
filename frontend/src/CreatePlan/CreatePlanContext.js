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
    // Plan Errors
    planSubmittedError: false,
    runsPerWeekError: false,
    runsPerWeekWarning: false,
    insightsFound: false,
    // Plan Details
    distance: null,
    goalType: null,
    goalTime: null,
    finishDate: null,
    startDate: null,
    runsPerWeek: null,
    includeTaper: false,
    includeCrossTrain: false,
    longRunDay: null,
    blockedDays: [],
    planName: null,
    // Runner Insights
    fiveKm: {
      completed: false,
      time: null,
      date: null,
    },
    tenKm: {
      completed: false,
      time: null,
      date: null,
    },
    halfMarathon: {
      completed: false,
      time: null,
      date: null,
    },
    marathon: {
      completed: false,
      time: null,
      date: null,
    },
    avgRunsPerWeek: null,
    modeLongRunDay: null,
    additionalActivities: [],
  });

  return (
    <CreatePlanContext.Provider value={[state, setState]}>
      {props.children}
    </CreatePlanContext.Provider>
  );
};

export { CreatePlanContext, CreatePlanProvider };

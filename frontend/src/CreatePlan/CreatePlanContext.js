import React, { useState } from "react";

/* 
  Using the useContext Hook, this is where we provide all of the state variables that are used by multiple components
  in the plan creation flow
*/

const CreatePlanContext = React.createContext([{}, () => {}]);

const CreatePlanProvider = (props) => {
  const [state, setState] = useState({
    step: 0,
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
    planSubmitted: false,
  });

  return (
    <CreatePlanContext.Provider value={[state, setState]}>
      {props.children}
    </CreatePlanContext.Provider>
  );
};

export { CreatePlanContext, CreatePlanProvider };

import React, { useState, useEffect } from "react";

const CreatePlanContext = React.createContext([{}, () => {}]);

const CreatePlanProvider = (props) => {
  const [state, setState] = useState({
    step: 1,
    distance: null,
    goalType: null,
    goalTime: null,
    finishDate: null,
    runsPerWeek: null,
    includeTaper: false,
    includeCrossTrain: false,
    longRunDay: null,
    blockedDays: [],
    // errors
    runsPerWeekError: false,
    goalTimeError: false,
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <CreatePlanContext.Provider value={[state, setState]}>
      {props.children}
    </CreatePlanContext.Provider>
  );
};

export { CreatePlanContext, CreatePlanProvider };

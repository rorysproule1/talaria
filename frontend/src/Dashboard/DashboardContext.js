import React, { useState } from "react";

/* 
  Using the useContext Hook, this is where we provide all of the state variables that are used by multiple components
  on the Dashboard
*/

const DashboardContext = React.createContext([{}, () => {}]);

const DashboardProvider = (props) => {
  const [state, setState] = useState({
    plans: [],
  });

  return (
    <DashboardContext.Provider value={[state, setState]}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardProvider };

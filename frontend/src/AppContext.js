import React, { useState } from "react";

/* 
  Using the useContext Hook, this is where we provide all of the state variables that are used throughout the app
*/

const AppContext = React.createContext([{}, () => {}]);

const AppProvider = (props) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    athleteID: null,
  });

  return (
    <AppContext.Provider value={[user, setUser]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

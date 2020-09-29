import React, { useState, useEffect } from "react";
// import axios from "axios";
import SignInSide from "./SignIn/SignIn";
import Dashboard from "./Dashboard/Dashboard";
import LogIn from "./LogIn/LogIn";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import SignUp from "./SignUp/SignUp";
import CreatePlan from "./CreatePlan/CreatePlan";

function App() {
  // const [currentTime, setCurrentTime] = useState(0);
  // const [allActivities, setAllActivities] = useState([]);

  useEffect(() => {  
    // axios
    //   .get(`/activities`, {})
    //   .then((response) => {
    //     console.log(response.data["activities"]);
    //     setAllActivities(response.data["activities"]);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // axios.post(`/users`, data, {})
    //   .then((response) => {
    //     console.log(response)

    //   })
    //   .catch((error) => {
    //     console.log('Error while posting user')
    //     console.log(error)
    //   })

    // fetch("/time")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setCurrentTime(data.time);
    //   });
  }, []); // empty list to ensure code is only executed on initial loading of the page

  return (
    <main>
      {/* Full list of URLs used in the app */}
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/sign-in" component={SignInSide} />
        <Route exact path="/create-plan" component={CreatePlan} />
      </Switch>
    </main>
  );
}

export default App;

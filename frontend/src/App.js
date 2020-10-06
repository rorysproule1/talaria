import React from "react";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import LogIn from "./LogIn/LogIn";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import CreatePlan from "./CreatePlan/CreatePlanWrapper";

function App() {

  return (
    <main>
      {/* Full list of URLs used in the app */}
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/create-plan" component={CreatePlan} />
      </Switch>
    </main>
  );
}

export default App;

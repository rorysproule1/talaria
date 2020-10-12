import React from "react";
import "./App.css";
import Dashboard from "./Dashboard/Dashboard";
import LogIn from "./LogIn/LogIn";
import { Switch, Route } from "react-router-dom";
import CreatePlan from "./CreatePlan/CreatePlanWrapper";
import NotFound from "./assets/js/NotFound";
import ErrorBoundary from "./assets/js/ErrorBoundary";

function App() {
  return (
    <main>
      {/* Full list of URLs used in the app */}
      <ErrorBoundary>
        <Switch>
        
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/create-plan" component={CreatePlan} />

          {/* 404 page if the url doesn't match any of the URLs */}
          <Route component={NotFound} />
        
        </Switch>
      </ErrorBoundary>
    </main>
  );
}

export default App;

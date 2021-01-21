import React from "react";
import "./App.css";
import Dashboard from "./Dashboard/DashboardWrapper";
import LogIn from "./LogIn/LogIn";
import { Switch, Route } from "react-router-dom";
import CreatePlan from "./CreatePlan/CreatePlanWrapper";
import NotFound from "./assets/js/NotFound";
import ErrorBoundary from "./assets/js/ErrorBoundary";
import * as urls from "./assets/utils/urls";

function App() {
  return (
    <main>
      {/* ErrorBoundary provides fallback UI if any component wrapped in it crashes */}
      <ErrorBoundary>
        <Switch>
          {/* Full list of URLs used in the app */}
          <Route exact path={urls.Login} component={LogIn} />
          <Route exact path={urls.Dashboard} component={Dashboard} />
          <Route exact path={urls.CreatePlan} component={CreatePlan} />

          {/* 404 page if the url doesn't match any of the URLs */}
          <Route component={NotFound} />
        </Switch>
        {/* Fallback UI if any component crashes */}
      </ErrorBoundary>
    </main>
  );
}

export default App;

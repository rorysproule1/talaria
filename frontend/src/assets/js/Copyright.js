import React from "react";
import powered_by_strava from "../images/powered-by-strava.png";

export default function Copyright() {
  return (
    <p align="center">
      <img
        src={powered_by_strava}
        style={({ height: "96px" }, { width: "144px" })}
        className="center"
        alt="Powered by Strava"
      />
    </p>
  );
}

import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../assets/js/Header";

const localizer = momentLocalizer(moment);

const now = new Date();
const events = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2019, 6, 0),
    end: new Date(2019, 6, 1),
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2019, 3, 7),
    end: new Date(2019, 3, 10),
  },
  {
    id: 2,
    title: "Right now Time Event",
    start: now,
    end: now,
  },
];

export default function ViewPlan() {
  return (
    <React.Fragment>
      <Header connectToStrava={false} />
      <div style={{ height: "500pt" }}>
        <Calendar
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
        />
      </div>
    </React.Fragment>
  );
}

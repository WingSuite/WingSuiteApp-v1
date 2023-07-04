// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Calendar UI imports
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Time library imports
import moment from "moment";

// Calendar definition
export function CalendarComponent({ events, updateRange = () => {} }) {
  // define useState(s)
  const [view, setView] = useState(Views.MONTH);

  // Get the starting start end time
  useEffect(() => {
    const now = new Date();
    getStartEndTime(now);
  }, []);

  // Specify localization of the calendar
  const localizer = momentLocalizer(moment);

  // Specify the 24HR format
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HHmm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
      let s = localizer.format(start, "HHmm", culture);
      let e = localizer.format(end, "HHmm", culture);
      return `${s} - ${e}`;
    },
  };

  // Event customizing specification
  const customRBCEvent = ({ event }) => (
    <div>
      {console.log(event)}
      <div className="text-lg ">{event.title}</div>
      {view != Views.MONTH && <div className="text-xs">{event.unit}</div>}
    </div>
  );

  // Function to calculate the unix timestamp of the beginning and end month
  const getStartEndTime = (date) => {
    // Calculate times
    const startOfMonth = moment(date).startOf("month").unix();
    const endOfMonth = moment(date).endOf("month").unix();

    // Update a useState that is tracking the range
    updateRange({ start: startOfMonth, end: endOfMonth });
  };

  // Render calendar component
  return (
    <div
      style={{ height: "100vh" }}
      className="flex max-h-full w-full flex-col gap-2 overflow-y-hidden pr-2"
    >
      {console.log(events)}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onView={setView}
        onNavigate={getStartEndTime}
        showAllEvents={true}
        formats={formats}
        components={{
          event: customRBCEvent,
        }}
      />
    </div>
  );
}

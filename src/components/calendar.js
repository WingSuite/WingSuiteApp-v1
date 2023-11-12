// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Calendar UI imports
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// JS Cookies import
import Cookies from "js-cookie";

// Util imports
import { get } from "@/utils/call";

// Time library imports
import moment from "moment";

// Calendar definition
export function CalendarComponent({
  events,
  colorFormatting,
  updateRange = () => {},
  onEventClick = () => {},
}) {
  // define useState(s)
  const [view, setView] = useState(Views.MONTH);

  // Get the starting start end time
  useEffect(() => {
    // Get current timings
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

  // Specify card background color
  const eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event);
    return {
      style:  {
        backgroundColor:  colorFormatting[event.tag] || '#3174ad',
        color: 'black',
      },
    };
  };


  // Event customizing specification
  const customRBCEvent = ({ event }) => (
    <div>
      <div className="truncate text-base">{event.title}</div>
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
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onView={setView}
        onNavigate={getStartEndTime}
        onSelectEvent={onEventClick}
        showAllEvents={true}
        formats={formats}
        eventPropGetter={eventStyleGetter}
        components={{
          event: customRBCEvent,
        }}
      />
    </div>
  );
}

import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const ColoredEvent = ({ event }) => (
  <div className="">
    <strong>{event.title}</strong>
    <div>{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</div>
  </div>
)

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

const handleEventClick = (event) => {
  console.log(event);
}

// Let's create some events
const events = [
  {
    start: new Date(), // the event starts now
    end: new Date(new Date().valueOf() + 60 * 60 * 1000), // ends in 1 hour
    title: "My first event",
    id: 1234
  },
];

const MyCalendar = () => (
  <div style={{ height: 600 }}>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      onSelectEvent={handleEventClick}
      components={{
        event: ColoredEvent,
      }}
    />
  </div>
);

export default MyCalendar;
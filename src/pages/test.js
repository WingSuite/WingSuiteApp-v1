// Import necessary packages
import { useState } from "react";

export default function TimePicker() {
  // Set initial states
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  return (
    <>
      <div
        className="flex w-20 items-center justify-around
      rounded border-2 p-1"
      >
        <input
          placeholder="00"
          id="hour"
          pattern="[0-9]*"
          maxLength="2"
          value={hour}
          className="w-[2.05rem] rounded-lg px-1 text-xl"
          onKeyDown={(event) =>
            !/[0-9]/.test(event.key) &&
            !(event.key === "Backspace") &&
            !(event.key === "Delete") &&
            event.preventDefault()
          }
          onBlur={() => {
            if (parseInt(hour) > 23) setHour("00");
          }}
          onChange={(e) => setHour(e.target.value)}
        />
        :
        <input
          placeholder="00"
          id="minute"
          pattern="[0-9]*"
          maxLength="2"
          value={minute}
          className="w-[2.05rem] rounded-lg px-1 text-xl"
          onKeyDown={(event) =>
            !/[0-9]/.test(event.key) &&
            !(event.key === "Backspace") &&
            !(event.key === "Delete") &&
            event.preventDefault()
          }
          onBlur={() => {
            if (parseInt(minute) > 59) setMinute("00");
          }}
          onChange={(e) => setMinute(e.target.value)}
        />
      </div>
    </>
  );
}

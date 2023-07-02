// React.js & Next.js libraries
import { useState, useEffect } from "react";

// Input field with autocomplete feature
export function AutoCompleteInput({ possibleItems, value, onChange }) {
  // Define useStates
  const [availableChoices, setAvailableChoices] = useState(possibleItems);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Update the list based on the input
  useEffect(() => {
    // Change if inputValue is not empty
    if (inputValue != "") {
      // Filter input
      const filtered = possibleItems.filter((item) =>
        item.includes(inputValue)
      );

      // Set available choice
      setAvailableChoices(filtered);
    }
  }, [inputValue]);

  // Render component
  return (
    <div className="relative w-full">
      <input
        className="w-full rounded-lg border border-silver p-2 shadow-inner"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setInputValue(event.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        id="feedbackRecipient"
      />
      {inputValue != "" && isFocused && (
        <div
          className="absolute z-[999] flex max-h-32 w-full flex-col
          overflow-auto rounded-lg border border-silver bg-white"
        >
          {availableChoices.map((item, index) => (
            <button
              onClick={() => {
                onChange(item);
                setInputValue(item);
              }}
              key={`${item}-${index}`}
              className="rounded-lg px-2 py-0.5 text-left hover:bg-silver"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Time input field
export function TimeInput({
  hour,
  setHour,
  minute,
  setMinute,
}) {
  // Render component
  return (
    <div
      className="flex w-20 items-center justify-around
      rounded-lg border border-silver p-1"
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
  );
}

// React.js & Next.js libraries
import { useState, useEffect, useMemo } from "react";

// Autosize inputs import
import AutosizeInput from "react-input-autosize";

// Unique ID import
import { v4 as uuidv4 } from 'uuid';

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
          className="absolute z-[999] flex max-h-64 w-full flex-col
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
  id = null,
  textSize = "text-xl",
}) {
  // Render component
  return (
    <div
      className="flex w-fit items-center
      rounded-lg border border-silver p-1"
    >
      <AutosizeInput
        placeholder="00"
        id={`${id == null ? `` : id}-hour`}
        pattern="[0-9]*"
        maxLength="2"
        value={hour}
        className={`rounded-lg px-1 ${textSize}`}
        onKeyDown={(event) =>
          !/[0-9]/.test(event.key) &&
          !(event.key === "Backspace") &&
          !(event.key === "Delete") &&
          !(event.key === "Tab") &&
          event.preventDefault()
        }
        onBlur={() => {
          if (parseInt(hour) > 23) setHour("00");
        }}
        onChange={(e) => {setHour(e.target.value);}}
      />
      :
      <AutosizeInput
        placeholder="00"
        id={`${id == null ? `` : id}-minute`}
        pattern="[0-9]*"
        maxLength="2"
        value={minute}
        className={`rounded-lg px-1 ${textSize}`}
        onKeyDown={(event) =>
          {!/[0-9]/.test(event.key) &&
          !(event.key === "Backspace") &&
          !(event.key === "Delete") &&
          !(event.key === "Tab") &&
          event.preventDefault();}
        }
        onBlur={() => {
          if (parseInt(minute) > 59) setMinute("00");
        }}
        onChange={(e) => setMinute(e.target.value)}
      />
    </div>
  );
}

// Toggle switch input field
export function ToggleSwitch({ initialState = false, onToggle }) {
  // Define useStates for the component
  const [isOn, setIsOn] = useState(initialState);

  // Generate a unique ID for each instance of the ToggleSwitch
  const uniqueId = useMemo(() => uuidv4(), []);

  // useEffect to synchronize internal state with external prop
  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  // Function to track the toggling of the switch
  const toggle = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  // Render the toggle switch
  return (
    <div
      className="relative mr-2 inline-block w-[3.5rem] select-none rounded-full
      border border-silver align-middle transition duration-200 ease-in"
    >
      <input
        type="checkbox"
        name="toggle"
        id={uniqueId}
        checked={isOn}
        onChange={toggle}
        className="hidden"
      />
      <label
        htmlFor={uniqueId}
        className="bg-gray-300 block h-7 cursor-pointer overflow-hidden
        rounded-full"
      >
        <span
          className={`block h-7 w-7 transform rounded-full shadow-lg transition
          duration-200 ease-in ${
            isOn ? "translate-x-[1.6rem] bg-sky" : "translate-x-0 bg-silver"
          }`}
        ></span>
      </label>
    </div>
  );
}

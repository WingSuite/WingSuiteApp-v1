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
              className="rounded-lg py-0.5 px-2 text-left hover:bg-silver"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

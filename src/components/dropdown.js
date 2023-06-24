// React Icons
import { VscChevronUp, VscChevronDown } from "react-icons/vsc";

// React.js and Next.js libraries
import { useState } from "react";

// Define bottom dropdown subcomponent
export function BottomDropDown({
  listOfItems,
  setSelected,
  defaultValue = null,
}) {
  // Define variables
  const [innerElem, setInnerElem] = useState(listOfItems[0]);
  const [expanded, setExpanded] = useState(false);

  // Return definition of the dropdown subcomponent
  return (
    <div className={`relative w-full`}>
      <button
        className={`flex w-full justify-between rounded-lg border
        border-silver p-2 text-left shadow-inner`}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {defaultValue !== null ? defaultValue : innerElem}
        {(!expanded && <VscChevronDown size="1.5em" />) ||
          (expanded && <VscChevronUp size="1.5em" />)}
      </button>
      {expanded && (
        <div
          className={`absolute z-[999] flex max-h-64 w-full flex-col
          overflow-auto rounded-lg border border-silver bg-white`}
        >
          {listOfItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelected(item);
                setInnerElem(item);
                setExpanded(!expanded);
              }}
              className={`rounded-lg px-2 py-0.5 text-left hover:bg-silver`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Define bottom dropdown subcomponent
export function TopDropDown({ listOfItems, setSelected, defaultValue = null }) {
  // Define variables
  const [innerElem, setInnerElem] = useState(listOfItems[0]);
  const [expanded, setExpanded] = useState(false);

  // Return definition of the dropdown subcomponent
  return (
    <div className={`relative flex w-full flex-col`}>
      {expanded && (
        <div
          className={`absolute bottom-0 left-0 z-[999] mb-10 flex max-h-64
          w-full flex-col overflow-auto rounded-lg border border-silver
          bg-white shadow-inner`}
        >
          {listOfItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelected(item);
                setInnerElem(item);
                setExpanded(!expanded);
              }}
              className={`rounded-lg px-2 py-0.5 text-left hover:bg-silver`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <button
        className={`flex w-full justify-between rounded-lg border
        border-silver p-2 text-left shadow-inner`}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {defaultValue !== null ? defaultValue : innerElem}
        {(!expanded && <VscChevronUp size="1.5em" />) ||
          (expanded && <VscChevronDown size="1.5em" />)}
      </button>
    </div>
  );
}

// React Icons
import { VscChevronUp, VscChevronDown } from "react-icons/vsc";

// React.js and Next.js libraries
import { useState } from "react";

// Define bottom dropdown subcomponent
export function BottomDropDown({
  listOfItems,
  setSelected,
  bgColor = "white",
  headSize = "md",
  widthType = "fit",
  defaultValue = null,
}) {
  // Define variables
  const [innerElem, setInnerElem] = useState(listOfItems[0]);
  const [expanded, setExpanded] = useState(false);

  // Return definition of the dropdown subcomponent
  return (
    <div className={`relative w-${widthType}`}>
      <button
        className={`flex flex-row justify-between bg-${bgColor} text-${headSize}
        w-full gap-10 rounded-lg border-2 px-1.5 py-0.5 shadow-inner`}
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
          className={`absolute bg-${bgColor} z-[999] w-full rounded-lg
          border-2 shadow-inner`}
        >
          {listOfItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelected(item);
                setInnerElem(item);
                setExpanded(!expanded);
              }}
              className={`hover:bg-gray-100 flex w-full justify-start rounded-lg
              px-1.5 text-sm text-black`}
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
export function TopDropDown({
  listOfItems,
  setSelected,
  bgColor = "white",
  headSize = "md",
  widthType = "fit",
  defaultValue = null,
}) {
  // Define variables
  const [innerElem, setInnerElem] = useState(listOfItems[0]);
  const [expanded, setExpanded] = useState(false);

  // Return definition of the dropdown subcomponent
  return (
    <div className={`relative flex flex-col w-${widthType}`}>
      {expanded && (
        <div
          className={`absolute bg-${bgColor} bottom-0 left-0 z-[999]
          mb-10 w-full rounded-lg border-2 shadow-inner`}
        >
          {listOfItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelected(item);
                setInnerElem(item);
                setExpanded(!expanded);
              }}
              className={`hover:bg-gray-100 flex w-full justify-start rounded-lg px-4
              text-sm text-black`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <button
        className={`flex flex-row justify-between bg-${bgColor} text-${headSize}
        w-full gap-10 rounded-lg border-2 px-1.5 py-0.5 shadow-inner`}
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

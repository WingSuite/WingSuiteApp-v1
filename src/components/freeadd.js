// React Icons
import { VscAdd, VscChromeClose, VscCheck, VscTrash } from "react-icons/vsc";
import { IconContext } from "react-icons";

// Auto-Resizable Input Import
import AutosizeInput from "react-input-autosize";

// Custom imports
import { AutoCompleteInput } from "./input";
import { errorToaster } from "./toasters";
import { BottomDropDown } from "./dropdown";

// React.js and Next.js libraries
import { useState } from "react";

// View functionality component definition
export function FreeAdd({
  itemList,
  setItemList,
  type,
  spanFullWidth = false,
  dropDown = false,
  unremovable = [],
  additionalList = [],
}) {
  // Initialization of useState(s)
  const [index, setIndex] = useState(-1);

  // Handle change of the input field's content
  const handleInputChange = (index, value) => {
    // Check if the value is in the list
    if (itemList.includes(value)) {
      // Send error message and return
      errorToaster(`"${value}" ${type} already exists`);
      return;
    }

    // Update statuses
    const newInputs = [...itemList];
    newInputs[index] = value;
    setItemList(newInputs, type);
  };

  // Update statuses on element delete
  const handleDeleteItem = (index) => {
    const newList = [...itemList];
    newList.splice(index, 1);
    setItemList(newList, type);
  };

  // Confirmation selection content
  const confirmation = (
    <div className="ml-1 flex flex-row gap-1">
      {spanFullWidth ? (
        <>
          <button
            onClick={() => {
              handleDeleteItem(index);
              setIndex(-1);
            }}
          >
            <IconContext.Provider value={{ color: "#000000", size: `1.3em` }}>
              <VscCheck />
            </IconContext.Provider>
          </button>
          <button
            onClick={() => {
              setIndex(-1);
            }}
          >
            <IconContext.Provider value={{ color: "#000000", size: `1.3em` }}>
              <VscChromeClose />
            </IconContext.Provider>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setIndex(-1);
            }}
          >
            <IconContext.Provider value={{ color: "#000000", size: `1.3em` }}>
              <VscChromeClose />
            </IconContext.Provider>
          </button>
          <button
            onClick={() => {
              handleDeleteItem(index);
              setIndex(-1);
            }}
          >
            <IconContext.Provider value={{ color: "#000000", size: `1.3em` }}>
              <VscCheck />
            </IconContext.Provider>
          </button>
        </>
      )}
    </div>
  );

  // Add item button
  const addItemButton = (
    <button
      className={`flex flex-row items-center justify-center gap-1
      rounded-lg border-2 border-dashed border-sky px-1 ${
        spanFullWidth ? "w-full" : "w-auto"
      } hover:-translate-y-[0.09rem] hover:drop-shadow-lg`}
      onClick={() => {
        setItemList(
          [
            ...itemList,
            `${type.charAt(0).toUpperCase() + type.slice(1)} #${
              itemList.length + 1
            }`,
          ],
          type
        );
      }}
    >
      <IconContext.Provider value={{ color: "#54C0FF", size: `1.3em` }}>
        <VscAdd />
      </IconContext.Provider>
      <div className={`text-lg text-sky`}>
        {`Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      </div>
    </button>
  );

  // Input component isolation
  const IIso = ({ item, idx }) => {
    return (
      <input
        type="text"
        value={item}
        style={{ background: "transparent" }}
        className={`text-poppins w-full bg-transparent px-1 text-lg
      placeholder-silver`}
        onChange={(e) => handleInputChange(idx, e.target.value)}
      />
    );
  };

  // AutoSizeInput component isolation
  const AIIso = ({ item, idx }) => {
    return (
      <AutosizeInput
        type="text"
        value={item}
        inputStyle={{ background: "transparent" }}
        className={`text-poppins w-full px-1 text-lg
        placeholder-silver`}
        onChange={(e) => handleInputChange(idx, e.target.value)}
      />
    );
  };

  // Add item button component isolation
  const AIso = ({ idx }) => {
    return (
      <button
        className="ml-1.5"
        onClick={() => {
          setIndex(idx);
        }}
      >
        <IconContext.Provider value={{ color: "#000000", size: `1.3em` }}>
          <VscTrash />
        </IconContext.Provider>
      </button>
    );
  };

  // Return the component
  return (
    <div
      className={`flex ${spanFullWidth ? "w-full" : "w-auto"} flex-wrap gap-2`}
    >
      {itemList.map((item, idx) => (
        <div
          className={`bg-lightgray flex items-center gap-0.5 rounded-lg
          text-lg ${spanFullWidth ? "w-full" : "w-auto"}`}
          key={idx}
        >
          {spanFullWidth && dropDown && (
            <AutoCompleteInput
              possibleItems={additionalList}
              onChange={(e) => {
                handleInputChange(idx, e);
              }}
              value={item}
            />
          )}
          {spanFullWidth && !dropDown && <IIso item={item} idx={idx} />}
          {!spanFullWidth && <AIIso item={item} idx={idx} />}
          {unremovable.includes(item) && <></>}
          {!unremovable.includes(item) && !(index == idx) && <AIso idx={idx} />}
          {!unremovable.includes(item) && index == idx && confirmation}
        </div>
      ))}
      {addItemButton}
    </div>
  );
}

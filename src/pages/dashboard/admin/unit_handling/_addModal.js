// React Icons
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React import
import { useEffect, useState } from "react";

// Custom imports
import { BottomDropDown } from "@/components/dropdown";

// Config import
import { config } from "@/config/config";

// Define add unit modal
export default function AddUnitModal({
  selection = {},
  unitTypes = [],
  options = {},
  updateOptions = {},
  addFunc = () => {},
  closeModal = () => {},
}) {
  // Define UseStates
  const [confirm, setConfirm] = useState(false);

  // Update the parent info on change of selection
  useEffect(() => {
    updateOptions(
      "parent",
      selection.attributes == undefined ? "" : selection.attributes.parent_id
    );
  }, [selection]);

  // Render modal
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-5">
      <div className="flex flex-row gap-9">
        <div className="text-6xl">Add New Unit</div>
        <button className="-m-2 h-fit" onClick={() => closeModal()}>
          <IconContext.Provider value={{ size: "1.3em" }}>
            <VscChromeClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Parent Unit</div>
        {selection.attributes == undefined ? (
          <div className="text-base">{config.orgName}</div>
        ) : (
          <div className="text-base">{selection.attributes.parent_name}</div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Unit Name</div>
        <input
          id="name"
          className="w-full rounded-lg border border-silver p-2
          shadow-inner"
          onChange={(event) => updateOptions("name", event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Unit Type</div>
        <BottomDropDown
          listOfItems={Object.keys(unitTypes)}
          setSelected={(e) => updateOptions("unit_type", e)}
          defaultValue={options.unit_type || "Select Unit Type"}
        />
      </div>
      <div className="mt-2 flex flex-col">
        {!confirm && (
          <button
            className="w-fit rounded-lg border border-silver p-2 text-2xl
            transition duration-200 ease-in hover:-translate-y-[0.1rem]
            hover:border-sky hover:text-sky hover:shadow-md
            hover:shadow-sky"
            onClick={() => setConfirm(true)}
          >
            Add New Unit
          </button>
        )}
        {confirm && (
          <div
            className="flex w-fit flex-row items-center gap-2 rounded-lg border
            border-sky p-2 text-2xl text-sky"
          >
            <div className="">Are You Sure?</div>
            <button
              className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-sky"
              onClick={() => setConfirm(false)}
            >
              <IconContext.Provider
                value={{ size: "1.3em", className: "ml-2" }}
              >
                <VscChromeClose />
              </IconContext.Provider>
            </button>
            <button
              className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-sky"
              onClick={() => addFunc()}
            >
              <IconContext.Provider
                value={{ size: "1.3em", className: "ml-2" }}
              >
                <VscCheck />
              </IconContext.Provider>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

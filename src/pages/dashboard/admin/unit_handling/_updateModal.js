// React Icons
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React import
import { useEffect, useState } from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Config import
import { config } from "@/config/config";

// Autosize inputs import
import AutosizeInput from "react-input-autosize";

// Custom imports
import { BottomDropDown } from "@/components/dropdown";
import { Nothing } from "@/components/nothing";

// Util imports
import { title } from "@/utils/stringUtils";
import { post } from "@/utils/call";

// Define add unit modal
export default function UpdateUnitModal({
  selection = {},
  unitTypes = {},
  unitTypesR = {},
  options = {},
  updateOptions = () => {},
  updateFunc = () => {},
  deleteFunc = () => {},
  closeModal = () => {},
}) {
  // Define UseStates
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [parent, setParent] = useState("");
  const [unitData, setUnitData] = useState({});
  const [officersList, setOfficersList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [unitMap, setUnitMap] = useState({});
  const [unitMapR, setUnitMapR] = useState({});

  // Update the parent info on change of selection
  useEffect(() => {
    // Get the unit information
    (async () => {
      // Call API endpoint
      // #region
      var res = await post(
        "/unit/get_unit_info/",
        { id: selection._id },
        Cookies.get("access")
      );
      setUnitData(res.message);
      // #endregion

      // Get the parent information if a parent is specified
      // #region
      if (res.message.parent != "") {
        // Call API endpoint to get parent information
        res = await post(
          "/unit/get_unit_info/",
          { id: res.message.parent },
          Cookies.get("access")
        );
        setParent(res.message.name);
      }
      // #endregion

      // Get all the officers of the unit
      // #region
      var res = await post(
        "/unit/get_all_officers/",
        { id: selection._id },
        Cookies.get("access")
      );
      setOfficersList(res.message);
      // #endregion

      // Get all the members of the unit
      // #region
      var res = await post(
        "/unit/get_all_members/",
        { id: selection._id },
        Cookies.get("access")
      );
      setMembersList(res.message);
      // #endregion

      // Get the unit maps
      // #region

      // Call API to get unit list data
      var res = await post(
        "/unit/get_all_units/",
        { page_size: 2000, page_index: 0 },
        Cookies.get("access")
      );

      // Calculate mappings
      var unitIDMap = {};
      var reverseUnitIDMap = {};
      unitIDMap[""] = config.orgName;
      reverseUnitIDMap[config.orgName] = "";
      for (let item of res.message) {
        unitIDMap[item._id] = item.name;
        reverseUnitIDMap[item.name] = item._id;
      }

      // Save mappings to useStates
      setUnitMap(unitIDMap);
      setUnitMapR(reverseUnitIDMap);

      // #endregion
    })();
  }, [selection]);

  // Render modal
  return (
    <div className="flex min-w-[50rem] flex-col gap-4 rounded-lg bg-white p-5">
      <div className="flex flex-row justify-between gap-9">
        <div className="-my-3 flex flex-col text-7xl">
          <AutosizeInput
            className={`${editMode && `text-sky`}`}
            inputStyle={{ background: "transparent" }}
            value={options.name}
            disabled={!editMode}
            onChange={(e) => {
              updateOptions("name", e.target.value);
            }}
          />
        </div>
        <button className="-m-2 h-fit" onClick={() => closeModal()}>
          <IconContext.Provider value={{ size: "1.3em" }}>
            <VscChromeClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Parent Unit</div>
        {!editMode && (
          <>
            {parent == "" ? (
              <div className="text-base">{config.orgName}</div>
            ) : (
              <div className="text-base">{parent}</div>
            )}
          </>
        )}
        {editMode && (
          <div className="text-sky">
            <BottomDropDown
              listOfItems={Object.keys(unitMapR)}
              setSelected={(e) => {
                updateOptions("parent", unitMapR[e]);
              }}
              defaultValue={unitMap[options.parent] || unitMapR[options.parent]}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Unit Type</div>
        {!editMode && (
          <div className="text-base">{title(unitData.unit_type || "")}</div>
        )}
        {editMode && (
          <div className="text-sky">
            <BottomDropDown
              listOfItems={Object.keys(unitTypes)}
              setSelected={(e) => updateOptions("unit_type", unitTypes[e])}
              defaultValue={
                unitTypesR[options.unit_type] || unitTypes[options.unit_type]
              }
            />
          </div>
        )}
      </div>
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="flex h-fit w-1/2 flex-col gap-2">
          <div className="w-full text-2xl">Officers</div>
          {officersList.length == 0 ? (
            <Nothing mainText={"No Officers"} marginFlag={false} />
          ) : (
            <>
              {officersList.map((item) => (
                <div
                  className="w-full truncate text-sm"
                  key={`officer-${item.full_name}`}
                >{`${item.rank != undefined ? item.rank + ` ` : "N/T "}${
                  item.full_name
                }`}</div>
              ))}
            </>
          )}
        </div>
        <div className="flex h-fit w-1/2 flex-col gap-2">
          <div className="w-full text-2xl">Members</div>
          {membersList.length == 0 ? (
            <Nothing mainText={"No Members"} marginFlag={false} />
          ) : (
            membersList.map((item) => (
              <div
                className="w-full truncate text-sm"
                key={`member-${item.full_name}`}
              >{`${item.rank != undefined ? item.rank + ` ` : "N/T "}${
                item.full_name
              }`}</div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-row gap-5 text-2xl">
        {!editMode && !deleteMode && (
          <button
            onClick={() => {
              setEditMode(true);
            }}
            className="mt-4 rounded-lg border border-transparent px-1
            py-0.5 text-left text-sky transition duration-200 ease-in
            hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
            hover:shadow-md"
          >
            Edit
          </button>
        )}
        {editMode && (
          <div
            className="mt-4 flex flex-row gap-2 rounded-lg border border-sky
            px-1 py-0.5 text-left text-sky "
          >
            <div>Save Changes?</div>
            <button
              className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-sky"
              onClick={() => {
                setEditMode(false);
              }}
            >
              <VscChromeClose />
            </button>
            <button
              className="mr-0.5 transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-sky"
              onClick={() => {
                setEditMode(false);
                updateFunc();
              }}
            >
              <VscCheck />
            </button>
          </div>
        )}
        {!deleteMode && !editMode && (
          <button
            onClick={() => setDeleteMode(true)}
            className="mt-4 rounded-lg border border-transparent px-1
            py-0.5 text-left text-darkScarlet transition duration-200 ease-in
            hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
            hover:shadow-md"
          >
            Delete
          </button>
        )}
        {deleteMode && (
          <div
            className="mt-4 flex flex-row gap-2 rounded-lg border
            border-darkScarlet px-1 py-0.5 text-left text-darkScarlet "
          >
            <div>Are You Sure?</div>
            <button
              className="transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-scarlet"
              onClick={() => setDeleteMode(false)}
            >
              <VscChromeClose />
            </button>
            <button
              className="mr-0.5 transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:text-scarlet"
              onClick={() => deleteFunc()}
            >
              <VscCheck />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

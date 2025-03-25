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
export default function InspectUnitModal({
  selection = {},
  closeModal = () => {},
}) {
  // Define UseStates
  const [parent, setParent] = useState("");
  const [unitData, setUnitData] = useState({});
  const [officersList, setOfficersList] = useState([]);
  const [membersList, setMembersList] = useState([]);

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

      // #endregion
    })();
  }, [selection]);

  // Render modal
  return (
    <div
      className="flex min-w-[50rem] flex-col gap-4 rounded-lg bg-white
      p-5"
    >
      <div className="flex flex-row justify-between gap-9">
        <div className="-my-3 flex flex-col text-7xl">
          <AutosizeInput
            inputStyle={{ background: "transparent" }}
            value={selection.name}
            disabled={true}
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
        {parent == "" ? (
          <div className="text-base">{config.orgName}</div>
        ) : (
          <div className="text-base">{parent}</div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Unit Type</div>
        <div className="text-base">{title(unitData.unit_type || "")}</div>
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
    </div>
  );
}

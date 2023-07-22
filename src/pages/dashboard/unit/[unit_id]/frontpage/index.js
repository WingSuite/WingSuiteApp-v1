// React Icons
import {
  VscEdit,
  VscEye,
  VscSave,
  VscChromeClose,
  VscCheck,
  VscEyeClosed,
} from "react-icons/vsc";
import { IoMdExit } from "react-icons/io";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Markdown imports
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Editor imports
import Editor from "@monaco-editor/react";

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitFrontpagePage() {
  // Define useStates and constants
  const [reverseUnitIDMap, setReversedUnitIDMap] = useState({});
  const [changeAccess, setChangeAccess] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [unitFrontPage, setUnitFrontPage] = useState(``);
  const [changes, setChanges] = useState(``);
  const [actionTrigger, setActionTrigger] = useState(false);
  const required = permissionsList.unit.frontpage;

  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get the user's information
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Get unit ID mapping in reverse order
    const unitIDMap = JSON.parse(localStorage.getItem("unitIDMap"));
    let reversedMap = {};
    for (let key in unitIDMap) {
      reversedMap[unitIDMap[key]] = key;
    }
    setReversedUnitIDMap(reversedMap);

    // Process unit information
    if (unit_id != undefined) {
      (async () => {
        // Call API to get the unit's information
        var res = await post(
          "/unit/get_unit_info/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // If a frontpage is found, save it
        const unitFrontPageInfo = res.message.frontpage;
        if (!(unitFrontPageInfo == undefined || unitFrontPageInfo == ""))
          setUnitFrontPage(res.message.frontpage);

        // Call API to get the units's officer list
        var res = await post(
          "/unit/get_all_officers/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // Check if the user is a superior officer
        var isSuperior = await post(
          "/unit/is_superior_officer/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // Check if the user is an officer of the unit or is an admin
        const isOfficer = res.message
          .map((item) => item._id)
          .includes(user._id);
        const hasAccess = permissionsCheck(required.change, user.permissions);
        const isAdmin = permissionsCheck([], user.permissions);
        const permitted =
          isAdmin || (hasAccess && isOfficer) || isSuperior.message;
        setChangeAccess(permitted);
      })();
    }
  }, [unit_id, actionTrigger]);

  // Call API to save frontpage changes
  const saveChanges = () => {
    (async () => {
      // Send API call to add user
      var res = await post(
        "/unit/update_frontpage/",
        {
          id: reverseUnitIDMap[unit_id],
          frontpage: changes,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);

      // Reset useStates
      setChanges(``);
      setSaveConfirm(false);
      setEditorMode(false);
      setPreviewMode(false);
      setActionTrigger(!actionTrigger);
    })();
  };

  // Define edit tray
  const editTray = (
    <>
      {changeAccess && (
        <div
          className="absolute bottom-0 right-0 mr-5 flex flex-row-reverse
          gap-4"
        >
          {!editorMode && (
            <button
              className="rounded-full border border-silver bg-white p-4
              transition duration-200 ease-in hover:-translate-y-[0.1rem]
              hover:border-sky hover:text-sky hover:shadow-lg"
              onClick={() => {
                setEditorMode(true);
                setChanges(unitFrontPage);
              }}
            >
              <IconContext.Provider value={{ size: "2.2em" }}>
                {editorMode ? <IoMdExit /> : <VscEdit />}
              </IconContext.Provider>
            </button>
          )}
          {editorMode && (
            <div className="flex gap-2 rounded-full bg-black">
              {exitConfirm && (
                <button
                  className="rounded-full border border-black bg-black p-4
                  text-white transition duration-200 hover:border-sky
                  hover:bg-sky"
                  onClick={() => {
                    setExitConfirm(!exitConfirm);
                    setEditorMode(false);
                  }}
                >
                  <IconContext.Provider value={{ size: "2.2em" }}>
                    <VscCheck />
                  </IconContext.Provider>
                </button>
              )}
              <button
                className="rounded-full border border-black bg-black p-4
                text-white transition duration-200 hover:border-sky
                hover:bg-sky"
                onClick={() => setExitConfirm(!exitConfirm)}
              >
                <IconContext.Provider value={{ size: "2.2em" }}>
                  {exitConfirm ? <VscChromeClose /> : <IoMdExit />}
                </IconContext.Provider>
              </button>
            </div>
          )}
          {editorMode && (
            <div className="flex gap-2 rounded-full bg-black">
              {saveConfirm && (
                <button
                  className="rounded-full border border-black bg-black p-4
                  text-white transition duration-200 hover:border-sky
                  hover:bg-sky"
                  onClick={() => saveChanges()}
                >
                  <IconContext.Provider value={{ size: "2.2em" }}>
                    <VscCheck />
                  </IconContext.Provider>
                </button>
              )}
              <button
                className="rounded-full border border-black bg-black p-4
                text-white transition duration-200 hover:border-sky
                hover:bg-sky"
                onClick={() => setSaveConfirm(!saveConfirm)}
              >
                <IconContext.Provider value={{ size: "2.2em" }}>
                  {saveConfirm ? <VscChromeClose /> : <VscSave />}
                </IconContext.Provider>
              </button>
            </div>
          )}
          {editorMode && (
            <button
              className={`rounded-full bg-black p-4 text-white transition
              duration-200 hover:bg-sky ${
                previewMode ? `bg-sky  hover:text-black` : ``
              }`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <IconContext.Provider value={{ size: "2.2em" }}>
                {previewMode ? <VscEye /> : <VscEyeClosed />}
              </IconContext.Provider>
            </button>
          )}
        </div>
      )}
    </>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-screen w-full flex-col overflow-y-auto">
        <PageTitle
          className="flex-none"
          customName={`Unit / ${unit_id} / Front Page`}
        />
        <div className="relative flex h-full w-full">
          {!editorMode && (
            <div
              className="absolute flex h-full w-full flex-col items-center
              overflow-y-auto bg-white"
            >
              <ReactMarkdown className="prose" rehypePlugins={[rehypeRaw]}>
                {unitFrontPage}
              </ReactMarkdown>
            </div>
          )}
          {editorMode && (
            <div className="h-full w-full">
              <Editor
                defaultLanguage="markdown"
                defaultValue={changes}
                onChange={setChanges}
                theme="GitHub"
                options={{
                  wordWrap: 'on'
                }}
              />
            </div>
          )}
          {editorMode && previewMode && (
            <div
              className="absolute flex h-full w-full flex-col items-center
              overflow-y-auto bg-white"
            >
              <ReactMarkdown className="prose" rehypePlugins={[rehypeRaw]}>
                {changes}
              </ReactMarkdown>
            </div>
          )}
          {editTray}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

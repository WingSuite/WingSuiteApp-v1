// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { config, permissionsList, quillConfigs } from "@/config/config";

// Quill editor and HTML import
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { AutoCompleteInput, ToggleSwitch } from "@/components/input";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Feedback page definitions
export default function FeedbackPage() {
  // Define useStates and other constants
  const [listOfNames, setListOfNames] = useState([]);
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackTo, setFeedbackTo] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmailNotify, setFeedbackEmailNotify] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(true);
  const required = permissionsList.feedback;
  const toolbarItems = ["Received", "Sent"];

  // On mount of the Next.js page
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Set access for toolbar and other information
    setToolbarAccess(permissionsCheck(required.toolbar, user.permissions));

    // Process everyone's name
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/everyone/",
        { page_size: 10000, page_index: 0 },
        Cookies.get("access")
      );

      // Iterate through each item of the response and store just the quotes
      let listOfNames = {};
      for (let item of res.message) {
        listOfNames[item.full_name] = item._id;
      }

      // Save the list of names
      setListOfNames(listOfNames);
    })();
  }, []);

  // Load feedback data based on selection used
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Reset feedback data
    setFeedbackData([]);

    // Process the user's feedbacks
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/get_feedbacks/",
        { page_size: 2000, page_index: 0, sent: toolbarSelect === 1 },
        Cookies.get("access")
      );

      // If resulting API results in an error, return
      if (res.status === "error") return;

      // Iterate through each item of the response and store the feedbacks
      // TODO: <!> OPTIMIZE FOR LOOP CALLS <!>
      // TODO: //////////// START ////////////
      let parsed = [];
      for (let item of res.message) {
        // Get the from user
        var from_user = await post(
          "/user/get_user/",
          { id: toolbarSelect == 0 ? item.from_user : item.to_user },
          Cookies.get("access")
        );

        // Push new information
        parsed.push([
          item.datetime_created,
          item.name,
          `${from_user.message.rank ? from_user.message.rank : ""} ${
            from_user.message.full_name
          }`,
          item.feedback,
          item._id,
          user._id == item.from_user ||
            user.permissions.includes(config.allAccessPermission),
        ]);
      }
      // TODO: ///////////// END /////////////

      // Store the quotes to the useState
      setFeedbackData(parsed);
    })();
  }, [toolbarSelect, actionTrigger]);

  // Function definition for sending feedback
  const sendFeedback = () => {
    // Get the target user's ID
    const target_user = listOfNames[feedbackTo];

    // Check if the target_user is undefined
    if (target_user === undefined) {
      errorToaster("Improper recipient value. Please check your input.");
      return;
    }

    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/statistic/feedback/create_feedback/",
        {
          to_user: target_user,
          name: feedbackName,
          feedback: feedbackText,
          notify_email: feedbackEmailNotify,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);
    })();

    // Clear inputs
    setFeedbackTo("");
    setFeedbackName("");
    setFeedbackText("");
    setFeedbackEmailNotify(false);
  };

  // Function definition for updating a feedback
  const updateFeedback = (id, title, text) => {
    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/statistic/feedback/update_feedback/",
        {
          id: id,
          name: title,
          feedback: text,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);

      // Trigger action
      setActionTrigger(!actionTrigger);
    })();
  };

  // Function definition for deleting a feedback
  const deleteFeedback = (id) => {
    // Send API call for deleting the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/statistic/feedback/delete_feedback/",
        {
          id: id,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
    })();

    // Trigger action
    setActionTrigger(!actionTrigger);
  };

  // Component for toolbar
  const toolbar = (
    <div className="flex flex-row justify-between py-3">
      <div className="flex flex-row gap-4">
        {toolbarItems.map((item, index) => (
          <button
            key={`toolbarItems-${item}`}
            className={`rounded-lg border px-3 py-2 text-xl transition
            duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg ${
              toolbarSelect == index
                ? `border-sky bg-gradient-to-tr from-deepOcean
                to-sky text-white hover:border-darkOcean`
                : `border-silver hover:border-sky`
            } `}
            onClick={() => setToolbarSelect(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        className={`flex flex-row gap-4 rounded-lg border px-3
        py-2 text-xl transition duration-200 ease-in hover:-translate-y-[0.1rem]
        hover:shadow-lg ${
          composerOpen
            ? `border-sky bg-gradient-to-tr from-deepOcean
            to-sky text-white hover:border-darkOcean`
            : `border-silver hover:border-sky`
        }`}
        onClick={() => setComposerOpen(!composerOpen)}
      >
        <IconContext.Provider
          value={{
            size: "1.2em",
          }}
        >
          <VscEdit />
        </IconContext.Provider>
        <div>Make Feedback</div>
      </button>
    </div>
  );

  // Component for Inbox
  const inbox = (
    <div className="flex max-h-full w-full flex-col gap-2 overflow-auto pr-2">
      {feedbackData.length === 0 ? (
        <Nothing
          icon={<VscCloseAll />}
          mainText={`No Feedback ${toolbarSelect == 0 ? `Provided` : `Sent`}`}
          subText={
            toolbarSelect == 0 ? `Keep Up the Good Work` : `Send a Fox-3`
          }
        />
      ) : (
        feedbackData.map((info, index) => (
          <CollapsableInfoCard
            id={info[4]}
            key={`feedbackInbox-${info[0]}-${index}`}
            date={formatMilDate(info[0])}
            title={info[1]}
            titleAppendix={
              <div className="flex flex-row items-center gap-1.5 text-sm">
                <div className="font-bold">
                  {toolbarSelect ? `To: ` : `From: `}
                </div>
                <div>{info[2]}</div>
              </div>
            }
            mainText={info[3]}
            updateFunc={toolbarSelect && info[5] ? updateFeedback : null}
            deleteFunc={toolbarSelect && info[5] ? deleteFeedback : null}
          />
        ))
      )}
    </div>
  );

  // Component for editor
  const editor = (
    <div
      className="flex max-h-full w-1/2 flex-col gap-5 overflow-auto pb-2
      pl-3"
    >
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Recipient</div>
        <AutoCompleteInput
          possibleItems={Object.keys(listOfNames)}
          onChange={setFeedbackTo}
          value={feedbackTo}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Feedback Title</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setFeedbackName(event.target.value)}
          value={feedbackName}
          id="feedbackTitle"
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Feedback</div>
        <div className="flex-1">
          <QuillNoSSRWrapper
            className="h-full pb-[4.2rem]"
            modules={quillConfigs.modules}
            formats={quillConfigs.formats}
            theme="snow"
            value={feedbackText}
            onChange={setFeedbackText}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Notify via Email?</div>
        <ToggleSwitch
          onToggle={setFeedbackEmailNotify}
          initialState={feedbackEmailNotify}
        />
      </div>
      <button
        onClick={sendFeedback}
        className="w-fit rounded-lg border border-silver bg-gradient-to-tr
        from-deepOcean to-sky bg-clip-text p-2 text-xl text-transparent
        transition duration-200 ease-in hover:-translate-y-[0.1rem]
        hover:border-sky hover:shadow-md hover:shadow-sky"
      >
        Send Feedback
      </button>
    </div>
  );

  // Render content
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        {toolbarAccess && toolbar}
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          {inbox}
          {composerOpen && editor}
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

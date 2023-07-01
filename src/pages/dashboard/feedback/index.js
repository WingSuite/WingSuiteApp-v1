// React Icons
import { VscBellSlash, VscCloseAll, VscEdit } from "react-icons/vsc";
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

// Config imports
import { config, permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { AutoCompleteInput } from "@/components/input";
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
  const required = permissionsList.feedback;
  const toolbarItems = ["Received", "Sent"];

  // On mount of the Next.js page
  useEffect(() => {
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

      // Iterate through each item of the response and store just the quotes
      let parsed = [];
      for (let item of res.message) {
        var from_user = await post(
          "/user/get_user/",
          { id: toolbarSelect == 0 ? item.from_user : item.to_user },
          Cookies.get("access")
        );
        parsed.push([
          item.datetime_created,
          item.name,
          from_user.message.full_name,
          item.feedback,
        ]);
      }

      // Store the quotes to the useState
      setFeedbackData(parsed);
    })();
  }, [toolbarSelect]);

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
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
    })();

    // Clear inputs
    setFeedbackTo("");
    setFeedbackName("");
    setFeedbackText("");
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
            key={`feedbackInbox-${info[0]}-${index}`}
            title={
              <div className="flex flex-row items-center gap-2">
                <div className="mr-3 text-base">{formatMilDate(info[0])}</div>
                <div>{info[1]}</div>
                <div className="text-darkSilver">- {info[2]}</div>
              </div>
            }
            mainText={info[3]}
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
        <textarea
          className="flex-1 rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => setFeedbackText(event.target.value)}
          value={feedbackText}
          id="feedback"
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

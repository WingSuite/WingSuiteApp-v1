// React Icons
import { VscChromeClose, VscEdit, VscCheck } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// Markdown component import
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Time imports
import moment from "moment";

// Config imports
import { permissionsList, quillConfigs } from "@/config/config";

// Quill editor and HTML import
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";

// Date Picker imports
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Modal imports
import Modal from "react-modal";
import ActionModal from "./_request";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { CollapsableInfoCard } from "@/components/cards";
import { BottomDropDown } from "@/components/dropdown";
import { ToggleSwitch } from "@/components/input";
import { Nothing } from "@/components/nothing";
import { TimeInput } from "@/components/input";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define router and get unit ID from URL
  const router = useRouter();
  const { task: task_id } = router.query;

  // Define useStates
  const [task, setTask] = useState({});
  const [taskEdit, setTaskEdit] = useState(false);
  const [payload, setPayload] = useState({});
  const [suspenseContent, setSuspenseContent] = useState({});
  const [actionTrigger, setActionTrigger] = useState(true);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [modalMode, setModalMode] = useState(false);
  const [modalSelect, setModalSelect] = useState({});
  const toolbarItems = ["Incomplete", "Pending", "Complete"];
  const completionKey = ["incomplete", "pending", "complete"];

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.view_and_edit)) return;

    // Get all data about the task
    (async () => {
      // Get the task data of
      var res = await post(
        "/statistic/task/get_task_info/",
        { id: task_id },
        Cookies.get("access")
      );

      // Save that data
      setTask(res.message);
    })();
  }, [actionTrigger]);

  // Reset payloads function
  const resetPayloads = () => {
    // Set the payload
    setPayload({
      name: task.name,
      description: task.description,
      auto_accept_requests: task.auto_accept_requests,
    });

    // Set the suspense information
    var unixObject = moment(task.suspense * 1000);
    setSuspenseContent({
      hour: unixObject.format("HH"),
      minute: unixObject.format("mm"),
      date: new Date(task.suspense * 1000),
    });
  };

  // Update payload content
  const updatePayload = (key, value) => {
    setPayload((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Update suspense content
  const updateSuspense = (key, value) => {
    setSuspenseContent((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Create task function
  const updateTask = () => {
    // Create copies of the inputs
    var copy = payload;
    var due = suspenseContent;

    /*
        INPUT CHECKING
    */
    //#region

    // Throw error if no name is provided
    if (!("name" in copy) || copy.name == undefined || copy.name == "") {
      errorToaster("No name was provided");
      return;
    }

    // Throw error if no suspense is provided
    if (
      due == {} ||
      due.minute == undefined ||
      due.minute == "" ||
      due.hour == undefined ||
      due.hour == "" ||
      due.date == undefined ||
      due.hour == ""
    ) {
      errorToaster("No suspense was provided");
      return;
    }

    // Throw error if no description is provided
    if (
      !("description" in copy) ||
      copy.description == undefined ||
      copy.description == "" ||
      copy.description == "<p><br></p>"
    ) {
      errorToaster("No description was provided");
      return;
    }

    // Set auto accept if no option was provided
    if (!("auto_accept_requests" in copy)) copy.auto_accept_requests = false;

    //#endregion

    /*
        SUSPENSE CALCULATION
    */
    //#region

    // Calculate suspense datetime
    var suspense_datetime = new Date(due.date);
    suspense_datetime.setHours(parseInt(due.hour));
    suspense_datetime.setMinutes(parseInt(due.minute));
    suspense_datetime = suspense_datetime.getTime() / 1000;

    // Save datetime
    copy.suspense = suspense_datetime;

    //#endregion

    // Process task creation
    (async () => {
      /*
          UPDATE TASK
      */
      //#region

      // Add id
      copy.id = task._id;

      // Create task
      var res = await post(
        "/statistic/task/update_task/",
        copy,
        Cookies.get("access")
      );

      // Send toaster message upon creation
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
      setActionTrigger(!actionTrigger);

      //#endregion
    })();

    // Exit
    setTaskEdit(false);
  };

  // Component for toolbar
  const toolbar = (
    <div className="flex flex-col justify-between gap-3 py-3">
      <div className="flex flex-row gap-4">
        {toolbarItems.map((item, index) => (
          <div className="relative">
            <button
              key={`toolbarItems-${item}`}
              className={`rounded-lg border px-3 py-2 text-xl transition
              duration-200 ease-in hover:-translate-y-[0.1rem] hover:shadow-lg
              ${
                toolbarSelect == index
                  ? `border-sky bg-gradient-to-tr from-deepOcean to-sky
                  text-white hover:border-darkOcean`
                  : `border-silver hover:border-sky`
              }`}
              onClick={() => setToolbarSelect(index)}
            >
              {item == "Pending" &&
                task.pending != undefined &&
                Object.keys(task.pending).length > 0 && (
                  <div
                    className="absolute -left-1 -top-1 z-10 h-4 w-4 rounded-full
                    bg-scarlet"
                  ></div>
                )}
              {item}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Define the sidebar information
  const sidebarInformation = (
    <div
      className="flex h-full w-1/3 flex-col gap-3 rounded-lg border
    border-silver p-4 shadow-md"
    >
      <div className="flex h-full flex-col gap-3">
        <div className="text-4xl">{task.name}</div>
        <ReactMarkdown
          className="custom-prose prose max-w-full text-base"
          rehypePlugins={[rehypeRaw]}
        >
          {task.description}
        </ReactMarkdown>
        <div className="flex flex-row gap-2 text-2xl">
          <div className="font-bold">Suspense: </div>
          <div>{formatMilDate(task.suspense, true)}</div>
        </div>
        <div className="flex flex-row gap-2 text-2xl">
          <div className="font-bold">Autocomplete? </div>
          <div>{task.auto_accept_requests ? "Yes" : "No"}</div>
        </div>
      </div>
      <div className="">
        <button
          className={`flex flex-row gap-4 rounded-lg border px-3
          py-2 text-xl transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:shadow-lg ${
            taskEdit
              ? `border-sky bg-gradient-to-tr from-deepOcean
            to-sky text-white hover:border-darkOcean`
              : `border-silver hover:border-sky`
          }`}
          onClick={() => {
            resetPayloads();
            setTaskEdit(!taskEdit);
          }}
        >
          <IconContext.Provider
            value={{
              size: "1.2em",
            }}
          >
            <VscEdit />
          </IconContext.Provider>
          <div>Edit Task</div>
        </button>
      </div>
    </div>
  );

  // Define the edit sidebar
  const sidebarEditMode = (
    <div
      className="flex h-full w-1/3 flex-col gap-3 overflow-y-auto rounded-lg
      border border-silver p-4 shadow-md"
    >
      <div className="flex flex-col gap-1">
        <div className="text-2xl text-sky">Task Name</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => updatePayload("name", event.target.value)}
          value={payload.name}
          id="feedbackTitle"
        />
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl text-sky">Description</div>
        <div className="flex-1">
          <QuillNoSSRWrapper
            className="h-full pb-[4.2rem]"
            modules={quillConfigs.modules}
            formats={quillConfigs.formats}
            theme="snow"
            value={payload.description}
            onChange={(event) => updatePayload("description", event)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="w-fit text-2xl text-sky">Suspense</div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-3 text-lg">
            Time (24hr Format):
            <TimeInput
              hour={suspenseContent.hour}
              setHour={(e) => {
                updateSuspense("hour", e);
              }}
              minute={suspenseContent.minute}
              setMinute={(e) => {
                updateSuspense("minute", e);
              }}
            />
          </div>
          <DayPicker
            showOutsideDays
            mode="single"
            selected={suspenseContent.date}
            defaultMonth={
              suspenseContent.date ? new Date(suspenseContent.date) : undefined
            }
            onSelect={(e) => {
              updateSuspense("date", e);
            }}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl text-sky">Auto Complete on Request?</div>
        <ToggleSwitch
          onToggle={(event) => {
            updatePayload("auto_accept_requests", event);
          }}
          initialState={payload.auto_accept_requests}
        />
      </div>
      <div
        className="mt-4 flex w-fit flex-row gap-2 rounded-lg border
        border-sky px-1 py-0.5 text-left text-2xl text-sky"
      >
        <div>Save Changes?</div>
        <button
          className="transition duration-200 ease-in hover:-translate-y-[0.1rem]
          hover:text-sky"
          onClick={() => {
            setTaskEdit(false);
          }}
        >
          <VscChromeClose />
        </button>
        <button
          className="first-letter: mr-0.5 transition duration-200 ease-in
          hover:-translate-y-[0.1rem] hover:text-sky"
          onClick={() => {
            updateTask();
          }}
        >
          <VscCheck />
        </button>
      </div>
    </div>
  );

  // Define the button set for the pending items
  const PendingButtonSet = ({ user_id }) => {
    return (
      <div className="flex flex-row gap-1">
        <button
          className="flex flex-row gap-4 rounded-lg border border-transparent
          px-2 py-1.5 text-xl transition duration-200 ease-in
          hover:border-bermuda hover:text-bermuda"
          onClick={() => {
            setModalSelect({
              title: "Approve User Request",
              actionButton: "Approve Request",
              action: "approve",
              user_id: user_id,
            });
            setModalMode(true);
          }}
        >
          Approve
        </button>
        <button
          className="flex flex-row gap-4 rounded-lg border border-transparent
          px-2 py-1.5 text-xl transition duration-200 ease-in
          hover:border-scarlet hover:text-scarlet"
          onClick={() => {
            setModalSelect({
              title: "Reject User Request",
              actionButton: "Reject Request",
              action: "reject",
              user_id: user_id,
            });
            setModalMode(true);
          }}
        >
          Reject
        </button>
      </div>
    );
  };

  // Define the button set for the complete items
  const CompleteButtonSet = ({ user_id }) => {
    return (
      <div className="flex flex-row gap-1">
        <button
          className="flex flex-row gap-4 rounded-lg border border-transparent
          px-2 py-1.5 text-xl transition duration-200 ease-in
          hover:border-scarlet hover:text-scarlet"
          onClick={() => {
            setModalSelect({
              title: "Deny User's Completion",
              actionButton: "Deny Completion",
              action: "deny",
              user_id: user_id,
            });
            setModalMode(true);
          }}
        >
          Deny
        </button>
      </div>
    );
  };

  // Define the task area
  const taskArea = (
    <div className="flex h-full w-2/3 flex-col">
      {toolbar}
      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto pt-2">
        {task[completionKey[toolbarSelect]] != undefined ? (
          Object.keys(task[completionKey[toolbarSelect]]).length == 0 ? (
            <div className="h-full">
              <Nothing mainText={"No One is Under This Category"} />
            </div>
          ) : (
            Object.keys(task[completionKey[toolbarSelect]]).map(
              (item, index) => (
                <CollapsableInfoCard
                  id={item}
                  title={task.name_map[item]}
                  mainText={task[completionKey[toolbarSelect]][item] || "N/A"}
                  startState={true}
                  actionButton={
                    <>
                      {toolbarSelect == 1 && (
                        <PendingButtonSet user_id={item} />
                      )}
                      {toolbarSelect == 2 && (
                        <CompleteButtonSet user_id={item} />
                      )}
                    </>
                  }
                />
              )
            )
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" customName={`Tasks / ${task.name}`} />
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden pb-2">
          {taskArea}
          {taskEdit ? sidebarEditMode : sidebarInformation}
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
      <Modal
        isOpen={modalMode}
        onRequestClose={() => {
          setModalMode(false);
        }}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className="m-auto flex w-1/2 flex-col items-center border-0
        outline-none"
        overlayClassName="flex items-center justify-center bg-black
        bg-opacity-30 fixed inset-0 z-[999]"
      >
        <ActionModal
          taskContent={task}
          closeModal={() => {
            setModalMode(false);
            setModalSelect({});
            setActionTrigger(!actionTrigger);
          }}
          title={modalSelect.title}
          actionButton={modalSelect.actionButton}
          action={modalSelect.action}
          user_id={modalSelect.user_id}
        />
      </Modal>
    </div>
  );
}

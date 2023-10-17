// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
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

// Markdown component import
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
import RequestCompletion from "./_request";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { AutoCompleteInput, ToggleSwitch } from "@/components/input";
import { errorToaster, successToaster } from "@/components/toasters";
import { CollapsableInfoCard } from "@/components/cards";
import { BottomDropDown } from "@/components/dropdown";
import { FreeAdd } from "@/components/freeadd";
import { TimeInput } from "@/components/input";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define useStates and other constants
  const [toolbarAccess, setToolbarAccess] = useState(false);
  const [toolbarSelect, setToolbarSelect] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [actionTrigger, setActionTrigger] = useState(true);
  const [modalMode, setModalMode] = useState(false);
  const [userID, setUserID] = useState("");
  const [selected, setSelected] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [payload, setPayload] = useState({});
  const [suspenseContent, setSuspenseContent] = useState({});
  const required = permissionsList.tasks;
  const toolbarItems = ["Your Tasks", "Dispatched"];
  const iconMapper = {
    incomplete: "❌",
    pending: "🛂",
    complete: "✅",
  };

  // Process on change of the taskbar selection and other actions
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the permissions of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));
    setUserID(user);

    // Set access for toolbar and other information
    setToolbarAccess(permissionsCheck(required.toolbar, user.permissions));

    // Get the user's tasks
    (async () => {
      // Set a variable to collect all types of tasks
      var tasks = [];

      // Get the user's tasks that have not been completed
      var res = await post(
        "/user/get_tasks/",
        { page_size: 2000, page_index: 0, get_completed: false },
        Cookies.get("access")
      );

      // Add to the tasks list
      if (res.status != "error") tasks = tasks.concat(res.message);

      // Get the user's tasks that have been completed
      res = await post(
        "/user/get_tasks/",
        { page_size: 2000, page_index: 0, get_completed: true },
        Cookies.get("access")
      );

      // Add to the tasks list
      if (res.status != "error") tasks = tasks.concat(res.message);

      // Sort the tasks by suspense date and then its completion status
      tasks.sort((a, b) => {
        // If suspense dates are the same, sort by status
        if (a.status === "complete" && b.status !== "complete") return 1;
        if (a.status !== "complete" && b.status === "complete") return -1;

        // Sort by suspense date
        if (a.suspense < b.suspense) return -1;
        if (a.suspense > b.suspense) return 1;

        // If both have the same status, they remain in their current order
        return 0;
      });

      // Save the data
      setTaskData(tasks);
    })();
  }, [actionTrigger, toolbarSelect, modalMode]);

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
        <div>Make Task</div>
      </button>
    </div>
  );

  // Complete button definition
  const CompleteButton = ({ info }) => {
    return (
      <button
        className="flex flex-row gap-4 rounded-lg border
        border-transparent px-2 py-1.5 text-xl transition
        duration-200 ease-in hover:border-sky hover:text-sky"
        onClick={() => {
          setModalMode(true);
          setSelected(info);
        }}
      >
        Complete
      </button>
    );
  };

  // Footnote component definition
  const Footnote = ({ info }) => {
    return (
      <div className="mt-3 flex flex-col">
        <div className="text-3xl">
          {info.status == "pending"
            ? "Your Request Message:"
            : "Authority's Message:"}
        </div>
        <ReactMarkdown
          className="custom-prose prose max-w-full"
          rehypePlugins={[rehypeRaw]}
        >
          {info.message == "" ? "N/A" : info.message}
        </ReactMarkdown>
      </div>
    );
    1;
  };

  // Component for inbox
  const inbox = (
    <div className="flex max-h-full w-full flex-col gap-2 overflow-auto pr-2">
      {taskData.length === 0 ? (
        <Nothing
          icon={<VscCloseAll />}
          mainText={`No Tasks ${toolbarSelect == 0 ? `to Do` : `Dispatched`}`}
          subText={
            toolbarSelect == 0
              ? `Go Take a Break`
              : `Let's Get the Gears Moving!`
          }
        />
      ) : (
        taskData.map((info, index) => (
          <CollapsableInfoCard
            id={`task-${toolbarSelect}-${info._id}`}
            key={`task-${toolbarSelect}-${info._id}`}
            title={info.name}
            titleAppendix={
              <div className="flex flex-row gap-2">
                <div className="font-bold">Suspense: </div>
                <div>{formatMilDate(info.suspense, true)}</div>
              </div>
            }
            mainText={info.description}
            icon={iconMapper[info.status]}
            actionButton={
              info.status == "incomplete" ? (
                <CompleteButton info={info} />
              ) : (
                <></>
              )
            }
            footnote={<Footnote info={info} />}
          />
        ))
      )}
    </div>
  );

  // Component for composer
  const composer = (
    <div
      className="flex max-h-full w-1/2 flex-col gap-5 overflow-auto pb-2
      pl-3 pr-2"
    >
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Task Name</div>
        <input
          className="rounded-lg border border-silver p-2 shadow-inner"
          onChange={(event) => updatePayload("name", event.target.value)}
          value={payload.name}
          id="feedbackTitle"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Users</div>
        <div className="rounded-lg border border-silver p-2">
          <FreeAdd
            itemList={payload.users ? payload.users : []}
            setItemList={(content, key) => {
              updatePayload("users", content);
              console.log(content);
            }}
            type={"users"}
            additionalList={["a", "b", "c", "d", "e", "f"]}
            spanFullWidth={true}
            dropDown={true}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="w-fit text-2xl">Suspense</div>
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
            onSelect={(e) => {
              updateSuspense("date", e);
            }}
          />
        </div>
      </div>
      <div className="flex h-full flex-col gap-1">
        <div className="text-2xl">Description</div>
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
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Auto Complete on Request?</div>
        <ToggleSwitch
          onToggle={(event) => {
            updatePayload("auto_accept_requests", event);
          }}
          initialState={payload.auto_accept_requests}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-2xl">Notify via Email?</div>
        <ToggleSwitch
          onToggle={(event) => {
            updatePayload("notify_email", event);
          }}
          initialState={payload.notify_email}
        />
      </div>
      <button
        onClick={() => {}}
        className="w-fit rounded-lg border border-silver bg-gradient-to-tr
        from-deepOcean to-sky bg-clip-text p-2 text-xl text-transparent
        transition duration-200 ease-in hover:-translate-y-[0.1rem]
        hover:border-sky hover:shadow-md hover:shadow-sky"
      >
        Dispatch Task
      </button>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        {toolbarAccess && toolbar}
        <div className="flex h-full w-full flex-row gap-5 overflow-hidden">
          {inbox}
          {composerOpen && composer}
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
        <RequestCompletion
          taskContent={selected}
          closeModal={() => {
            setModalMode(false);
            setSelected({});
          }}
        />
      </Modal>
    </div>
  );
}

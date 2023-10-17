// React Icons
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { IconContext } from "react-icons";

// Quill editor and HTML import
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";

// React import
import { useEffect, useState } from "react";

// Config import
import { quillConfigs } from "@/config/config";

// JS Cookies import
import Cookies from "js-cookie";

// Util imports
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";

// Define request modal
export default function RequestCompletion({
  taskContent = {},
  closeModal = () => {},
}) {
  // Define UseStates
  const [confirm, setConfirm] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  // Send request call
  const request = () => {
    (async () => {
      // Call API endpoint for sending completion request
      var res = await post(
        "/statistic/task/request_completion/",
        {
          id: taskContent._id,
          message: requestMessage,
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster and trigger
      if (res.status == "success") successToaster(res.message);
      if (res.status == "error") errorToaster(res.message);
    })();
  };

  // Render modal
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white p-5">
      <div className="flex flex-row justify-between">
        <div className="text-6xl">Complete Task</div>
        <button className="-m-2 h-fit" onClick={() => closeModal()}>
          <IconContext.Provider value={{ size: "1.3em" }}>
            <VscChromeClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl">Message (Optional)</div>
        <div className="h-[30rem]">
          <QuillNoSSRWrapper
            className="h-full pb-[2.5rem]"
            modules={quillConfigs.modules}
            formats={quillConfigs.formats}
            theme="snow"
            value={requestMessage}
            onChange={setRequestMessage}
          />
        </div>
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
            Send Request
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
              onClick={() => {
                closeModal();
                request();
              }}
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

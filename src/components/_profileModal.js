// React Icons
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { IconContext } from "react-icons";

// Quill editor and HTML import
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";

// Inputs imports
import TextareaAutosize from "react-textarea-autosize";

// React and Next.js import
import Image from "next/image";
import { useEffect, useState } from "react";

// Config import
import { quillConfigs } from "@/config/config";

// JS Cookies import
import Cookies from "js-cookie";

// Image import
import logobw from "../../public/logobw.png";

// Util imports
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";

// Define request modal
export default function ProfileModal({}) {
  // Define UseStates
  const [whoami, setWhoami] = useState({});

  // Get the user's information
  useEffect(() => {
    setWhoami(JSON.parse(localStorage.getItem("whoami")));
    console.log(JSON.parse(localStorage.getItem("whoami")));
  }, []);

  // Render modal
  return (
    <div className="flex w-full flex-col gap-10 rounded-lg bg-white p-10">
      <div className="flex flex-row justify-between">
        <div className="text-6xl font-bold">Your Profile</div>
        <button className="-m-2 h-fit" onClick={() => closeModal()}>
          <IconContext.Provider value={{ size: "1.3em" }}>
            <VscChromeClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="flex flex-row gap-12">
        <div>
          <Image alt="Logo" src={logobw} width={300} height={300} />
        </div>
        <div className="flex flex-1 flex-col gap-7">
          <div className="flex flex-col">
            <div className="text-xl">Rank</div>
            <div className="text-3xl">{whoami.rank}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">First Name</div>
            <div className="text-3xl">{whoami.first_name}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">Middle Initial</div>
            <div className="text-3xl">{whoami.middle_initial}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">Last Name</div>
            <div className="text-3xl">{whoami.last_name}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">Email</div>
            <div className="text-3xl">{whoami.email}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">Phone Number</div>
            <div className="text-3xl">{whoami.phone_number}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">About Me</div>
            <textarea className="w-full resize-none rounded-lg border border-silver p-1 text-xs"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

// React Icons
import { VscCheck, VscChromeClose, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React and Next.js import
import Image from "next/image";
import { useEffect, useState } from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Image import
import logobw from "../../public/logobw.png";

// Util imports
import { post, get } from "@/utils/call";

// Toaster related imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config imports
import { config } from "@/config/config";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "./dropdown";

// Define request modal
export default function ProfileModal({ closeModal }) {
  // Define UseStates
  const [whoami, setWhoami] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [payload, setPayload] = useState({});
  const [actionTrigger, setActionTrigger] = useState(false);

  // Get the user's information
  useEffect(() => {
    (async () => {
      var res = await get("/user/who_am_i/", Cookies.get("access"));

      // If the user's access token is expired, refresh
      if (res.status == "expired") {
        // Get new access token and store it
        const new_access = await post(
          "/auth/refresh/",
          {},
          Cookies.get("refresh")
        );
        Cookies.set("access", new_access.access_token);
        access = new_access.access_token;
      }

      // Refresh who_am_i value and store it
      var res = await get("/user/who_am_i/", Cookies.get("access"));
      setWhoami(res);
    })();
  }, [actionTrigger]);

  // Update user's information
  const updateUser = () => {
    // Copy payload
    var copy = payload;

    // Check first name integrity
    if ("first_name" in copy && copy.first_name == "") {
      errorToaster("First name cannot by empty");
      return;
    }

    // Check last name integrity
    if ("last_name" in copy && copy.last_name == "") {
      errorToaster("Last name cannot by empty");
      return;
    }

    // Check phone integrity and update
    if ("phone1" in copy || "phone2" in copy || "phone3" in copy) {
      // Check phone integrity
      var phone1 = copy.phone1 || whoami.phone_number.slice(1, 4);
      var phone2 = copy.phone2 || whoami.phone_number.slice(6, 9);
      var phone3 = copy.phone3 || whoami.phone_number.slice(10, 14);
      const phone = `(${phone1}) ${phone2}-${phone3}`;
      if (!config.phoneRegex.test(phone)) {
        errorToaster("Phone input not properly filled or is empty");
        return;
      }

      // Update the phone field
      delete copy.phone1;
      delete copy.phone2;
      delete copy.phone3;
      copy.phone_number = phone;
    }

    // Send API call to change the user's information
    // If all is good, send the request for registration
    (async () => {
      // Send API call
      var res = await post(
        "/user/update_personal/",
        copy,
        Cookies.get("access")
      );

      // Pop toasters if the call was successful
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") {
        successToaster("Your profile has been updated");
      }
      setActionTrigger(!actionTrigger);
    })();
  };

  // Update payload content
  const updatePayload = (key, value) => {
    setPayload((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Preview component
  const infoView = (
    <>
      <div className="flex flex-col">
        <div className="text-xl">Title</div>
        {editMode ? (
          <BottomDropDown
            listOfItems={config.rankList}
            setSelected={(e) => updatePayload("rank", e)}
            defaultValue={payload.rank || whoami.rank}
            editColor={true}
          />
        ) : (
          <div className="text-3xl">{whoami.rank}</div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xl">First Name</div>
        {editMode ? (
          <input
            className="w-full rounded-lg border border-silver p-2 text-sky
            shadow-inner"
            onChange={(event) =>
              updatePayload("first_name", event.target.value)
            }
            value={
              "first_name" in payload ? payload.first_name : whoami.first_name
            }
            id="first_name"
          />
        ) : (
          <div className="text-3xl">{whoami.first_name}</div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xl">Middle Initial</div>
        {editMode ? (
          <input
            className="w-full rounded-lg border border-silver p-2 text-sky
            shadow-inner"
            onChange={(event) =>
              updatePayload("middle_initial", event.target.value)
            }
            value={
              "middle_initial" in payload
                ? payload.middle_initial
                : whoami.middle_initial
            }
            id="middle_initial"
          />
        ) : (
          <div className="text-3xl">{whoami.middle_initial}</div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xl">Last Name</div>
        {editMode ? (
          <input
            className="w-full rounded-lg border border-silver p-2 text-sky
            shadow-inner"
            onChange={(event) => updatePayload("last_name", event.target.value)}
            value={
              "last_name" in payload ? payload.last_name : whoami.last_name
            }
            id="last_name"
          />
        ) : (
          <div className="text-3xl">{whoami.last_name}</div>
        )}
      </div>
      <div className="flex flex-col overflow-x-auto overflow-y-hidden">
        <div className="text-xl">Email</div>
        <div className="overflow-x-auto overflow-y-hidden text-3xl">
          {whoami.email}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-xl">Phone Number</div>
        {editMode ? (
          <div
            className="flex w-full flex-row items-center
            justify-between"
          >
            <div className="text-xl">(</div>
            <input
              className="text-gray-700 focus:shadow-outline w-1/4 rounded-lg
              border border-silver bg-white/[0.3] p-2 text-sky
              shadow-inner focus:outline-none"
              id="phone1"
              maxLength="3"
              onChange={(event) => updatePayload("phone1", event.target.value)}
              value={
                "phone1" in payload
                  ? payload.phone1
                  : whoami.phone_number.slice(1, 4)
              }
              type="text"
            />
            <div className="text-xl">)</div>
            <input
              className="text-gray-700 focus:shadow-outline w-1/4 rounded-lg
              border border-silver bg-white/[0.3] p-2 text-sky
              shadow-inner focus:outline-none"
              id="phone2"
              maxLength="3"
              onChange={(event) => updatePayload("phone2", event.target.value)}
              value={
                "phone2" in payload
                  ? payload.phone2
                  : whoami.phone_number.slice(6, 9)
              }
              type="text"
            />
            <div className="text-3xl">-</div>
            <input
              className="text-gray-700 focus:shadow-outline w-1/4 rounded-lg
              border border-silver bg-white/[0.3] p-2 text-sky
              shadow-inner focus:outline-none"
              id="phone3"
              maxLength="4"
              onChange={(event) => updatePayload("phone3", event.target.value)}
              value={
                "phone3" in payload
                  ? payload.phone3
                  : whoami.phone_number.slice(10, 14)
              }
              type="text"
            />
          </div>
        ) : (
          <div className="text-3xl">{whoami.phone_number}</div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-xl">About Me</div>
        <textarea
          className={`custom-placeholder h-16 w-full resize-none rounded-lg
          border border-silver p-1 text-xs ${editMode ? "text-sky" : ``}`}
          disabled={!editMode}
          onChange={(event) => updatePayload("about_me", event.target.value)}
          value={
            editMode
              ? "about_me" in payload
                ? payload.about_me
                : whoami.about_me || ""
              : whoami.about_me || ""
          }
          a={console.log(
            editMode
              ? "about_me" in payload
                ? payload.about_me
                : whoami.about_me || ""
              : whoami.about_me || ""
          )}
          placeholder={editMode ? `Tell Something About Yourself!` : ""}
        ></textarea>
      </div>
    </>
  );

  // Render modal
  return (
    <div className="flex w-full flex-col gap-10 rounded-lg bg-white px-10 pt-10">
      <div className="flex flex-row justify-between">
        <div className="text-6xl font-bold">Your Profile</div>
        <button className="-m-2 h-fit" onClick={() => closeModal()}>
          <IconContext.Provider value={{ size: "1.3em" }}>
            <VscChromeClose />
          </IconContext.Provider>
        </button>
      </div>
      <div className="flex flex-row gap-12">
        <div className="flex flex-col gap-6">
          <div
            className="flex h-80 w-80 items-center justify-center
            overflow-hidden rounded-full"
          >
            <Image src={logobw} alt="Logo" objectFit="cover" />
          </div>
          {!editMode && (
            <button
              onClick={() => {
                setEditMode(true);
              }}
              className="mt-4 flex w-fit flex-row gap-2 self-center rounded-lg
              border border-black px-2 py-1.5 text-left text-2xl
              text-black transition duration-200 ease-in
              hover:-translate-y-[0.1rem] hover:border-sky hover:text-sky
              hover:shadow-md"
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscEdit />
              </IconContext.Provider>
              Edit Profile
            </button>
          )}
          {editMode && (
            <div
              className="mt-4 flex w-fit flex-row gap-2 self-center rounded-lg
              border border-sky px-2 py-1.5 text-left text-2xl text-sky"
            >
              <div>Save Changes?</div>
              <button
                className="transition duration-200 ease-in
                hover:-translate-y-[0.1rem] hover:text-sky"
                onClick={() => {
                  setPayload({});
                  setEditMode(false);
                }}
              >
                <VscChromeClose />
              </button>
              <button
                className="mr-0.5 transition duration-200 ease-in
                hover:-translate-y-[0.1rem] hover:text-sky"
                onClick={() => {
                  setPayload({});
                  updateUser();
                  setEditMode(false);
                }}
              >
                <VscCheck />
              </button>
            </div>
          )}
        </div>
        <div
          className="flex w-full flex-1 flex-col gap-7 overflow-x-auto
        overflow-y-hidden"
        >
          {infoView}
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

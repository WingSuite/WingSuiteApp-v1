// React Icons
import { VscAdd, VscChromeClose } from "react-icons/vsc";
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
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { AutoCompleteInput } from "@/components/input";
import PageTitle from "@/components/pageTitle";
import { UserCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitMembersPage() {
  // Define useStates
  const [reverseUnitIDMap, setReversedUnitIDMap] = useState({});
  const [membersList, setMembersList] = useState([]);
  const [officersList, setOfficersList] = useState([]);
  const [doesUserHasAccess, setDoesUseHasAccess] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const [actionTrigger, setActionTrigger] = useState(false);
  const required = permissionsList.unit.members;

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

    // Get the list of members and officers  based on the unit it
    if (unit_id != undefined) {
      (async () => {
        // Call API to get the units's member list
        var res = await post(
          "/unit/get_all_members/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // If the resulting information is successful, then set members list
        var members;
        if (res.status == "success") {
          members = res.message;
          setMembersList(members);
        }
        members = new Set(members.map((item) => item._id));

        // Call API to get the units's officer list
        var res = await post(
          "/unit/get_all_officers/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // If the resulting information is successful, then set members list
        var officers;
        if (res.status == "success") {
          officers = res.message;
          setOfficersList(officers);
        }
        officers = new Set(officers.map((item) => item._id));

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
        const hasAccess = permissionsCheck(required.handle, user.permissions);
        const isAdmin = permissionsCheck([], user.permissions);
        const permitted =
          isAdmin || (hasAccess && isOfficer) || isSuperior.message;
        setDoesUseHasAccess(permitted);

        // Get the user's feedback information
        if (permitted) {
          // Get every user in the organization
          var res = await post(
            "/user/everyone/",
            { page_size: 10000, page_index: 0 },
            Cookies.get("access")
          );

          // Iterate through each item of the response and store just the quotes
          let listOfNames = {};
          for (let item of res.message) {
            if (!members.has(item._id) && !officers.has(item._id))
              listOfNames[item.full_name] = item._id;
          }

          // Save the list of available users
          setAvailableUsers(listOfNames);
        }
      })();
    }
  }, [unit_id, actionTrigger]);

  // Function to define the sending of a new person
  const addUser = () => {
    // Get the target user's ID
    const target_user = availableUsers[selectedUser];

    // Check if the target_user is undefined
    if (target_user === undefined) {
      errorToaster("User not found. Please check your input.");
      return;
    }

    // Send API call to add the user
    (async () => {
      // Send API call to add user
      var res = await post(
        selectedAdd == 1 ? "/unit/add_officers/" : "/unit/add_members/",
        {
          id: reverseUnitIDMap[unit_id],
          users: [target_user],
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success")
        successToaster(`${selectedUser} has been added`);
      if (res.status == "error") errorToaster(res.message);

      // Reset useStates
      setSelectedAdd(0);
      setSelectedUser("");
      setActionTrigger(!actionTrigger);
    })();
  };

  // Function to remove users
  const removeUser = (id, name, type) => {
    // Send API call for deleting the user
    (async () => {
      // Get the user's feedback information
      var res = await post(
        type == 1 ? "/unit/delete_members/" : "/unit/delete_officers/",
        {
          id: reverseUnitIDMap[unit_id],
          users: [id],
        },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(`${name} has been removed`);
      if (res.status == "error") errorToaster(res.message);

      // Trigger action useState
      setActionTrigger(!actionTrigger);
    })();
  };

  // Add user card
  const addUserCard = (
    <div
      className="relative flex h-[320px] w-[290px] flex-col justify-between gap-1
      rounded-lg border-2 border-dashed border-silver p-2 pb-3 text-xs
      text-black"
    >
      <button
        className="flex flex-row-reverse gap-2"
        onClick={() => {
          setSelectedAdd(0);
          setSelectedUser("");
        }}
      >
        <IconContext.Provider value={{ size: "2em" }}>
          <VscChromeClose />
        </IconContext.Provider>
      </button>
      <div className="flex h-full flex-col justify-center gap-2 pb-20">
        <div className="pl-0.5 text-left text-lg">Select a User to Add</div>
        <AutoCompleteInput
          possibleItems={Object.keys(availableUsers)}
          onChange={setSelectedUser}
          value={selectedUser}
        />
      </div>
      <button
        disabled={selectedUser == ""}
        className={`rounded-lg border p-1 transition duration-200 ease-in
        ${
          selectedUser != ""
            ? `hover:border-sky hover:text-sky`
            : `border-silver text-silver`
        }`}
        onClick={addUser}
      >
        Add User
      </button>
    </div>
  );

  // Define the officer list section
  const officersDisplay = (
    <div className="flex flex-col gap-4">
      <div className="text-3xl">Officers</div>
      <div className="flex flex-wrap gap-4">
        {officersList.map((item) => (
          <UserCard
            key={`Officer-${item._id}`}
            id={item._id}
            name={item.full_name}
            rank={item.rank ? item.rank : "No Rank"}
            email={item.email}
            phone={item.phone_number}
            deleteFunc={
              doesUserHasAccess
                ? (id, name) => {
                    removeUser(id, name, 0);
                  }
                : null
            }
          />
        ))}
        {selectedAdd == 1 && addUserCard}
        {doesUserHasAccess && !(selectedAdd == 1) && (
          <button
            className="relative flex h-[320px] w-[290px] flex-col items-center
            justify-center gap-5 rounded-lg border-2 border-dashed
            border-silver p-4 text-silver transition duration-200 ease-in
            hover:border-2 hover:border-sky hover:text-sky"
            onClick={() => {
              setSelectedAdd(1);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <IconContext.Provider value={{ size: "2em" }}>
                <VscAdd />
              </IconContext.Provider>
              <div className="text-center text-xl">Add Officer</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  // Define the member list section
  const membersDisplay = (
    <div className="flex flex-col gap-4">
      <div className="text-3xl">Members</div>
      <div className="flex flex-wrap gap-4">
        {membersList.map((item) => (
          <UserCard
            id={item._id}
            key={`Member-${item._id}`}
            name={item.full_name}
            rank={item.rank ? item.rank : "No Rank"}
            email={item.email}
            phone={item.phone_number}
            deleteFunc={
              doesUserHasAccess
                ? (id, name) => {
                    removeUser(id, name, 1);
                  }
                : null
            }
          />
        ))}
        {selectedAdd == 2 && addUserCard}
        {doesUserHasAccess && !(selectedAdd == 2) && (
          <button
            className="relative flex h-[320px] w-[290px] flex-col items-center
            justify-center gap-5 rounded-lg border-2 border-dashed
            border-silver p-4 text-silver transition duration-200 ease-in
            hover:border-2 hover:border-sky hover:text-sky"
            onClick={() => {
              setSelectedAdd(2);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <IconContext.Provider value={{ size: "2em" }}>
                <VscAdd />
              </IconContext.Provider>
              <div className="text-center text-xl">Add Member</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-screen w-full flex-col overflow-y-auto">
        <PageTitle className="flex-none" />
        <div className="flex flex-col gap-8">
          {officersDisplay}
          {membersDisplay}
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

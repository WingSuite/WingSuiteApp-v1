// React Icons
import { VscCloseAll, VscEdit } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// Toaster Components and CSS
import { ToastContainer, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList, endPointsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { get, post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define router and get unit ID from URL
  const router = useRouter();

  // Define useStates
  const [filterUserList, setFilteredUserList] = useState([]);
  const [actionTrigger, setActionTrigger] = useState(false);
  const [permList, setPermList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.permissions_editing.page)) return;

    // Get the list of users
    (async () => {
      // Get the list of users
      var res = await post(
        endPointsList.admin.permissions_editing.data[0],
        { page_size: 2000, page_index: 0, allow_permissions: true },
        Cookies.get("access")
      );

      // Show error response status message
      if (res.status == "error") {
        errorToaster(res.message);
        return;
      }

      // Process the data to add a searchable id
      var processed = res.message.map((obj) => {
        return {
          ...obj,
          multipurpose: `${obj.rank != undefined ? obj.rank + ` ` : "N/R "}${
            obj.full_name
          }`,
        };
      });

      // Save the information to the userList useState
      setFilteredUserList(processed);
      setUserList(processed);
    })();

    // Get the list of permissions
    (async () => {
      // Get the list of permissions
      var res = await get(
        endPointsList.admin.permissions_editing.data[1],
        Cookies.get("access")
      );

      // Show error response status message
      if (res.status == "error") {
        errorToaster(res.message);
        return;
      }

      // Save the list of permissions
      setPermList(res.message);
    })();
  }, [actionTrigger]);

  // Apply search filter
  useEffect(() => {
    // Set the filtered user list to the actual user list if the search is empty
    if (search == "") {
      setFilteredUserList(userList);
      return;
    }

    // Filter the filtered user list if the search bar changed
    setFilteredUserList(
      userList.filter((item) =>
        item.multipurpose.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, userList]);

  // Update function
  const updateFeedback = (id, title, perms) => {
    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        endPointsList.admin.permissions_editing.update[0],
        { id: id, permissions: perms.split("\n") },
        Cookies.get("access")
      );

      // If the call was successful, send a success toaster
      if (res.status == "success") successToaster(`User's permissions updated`);
      if (res.status == "error") errorToaster(res.message);

      // Update the user's rank if it was changed
      if (title != "N/R") {
        // Call API to change rank
        res = await post(
          endPointsList.admin.permissions_editing.update[1],
          { id: id, rank: title },
          Cookies.get("access")
        );

        // If the call was successful, send a success toaster
        if (res.status == "success")
          successToaster(`User's rank updated`);
        if (res.status == "error") errorToaster(res.message);
      }

      // Trigger action
      setActionTrigger(!actionTrigger);
    })();
  };

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle
          className="flex-none"
          customName="Admin / Permissions Editing"
        />
        {userList.length == 0 ? (
          <Nothing
            mainText={"There are No Members in the Organization"}
            subText={"A tree falls in a forest, does it make a sound?"}
          />
        ) : (
          <div className="flex h-full flex-row gap-2 overflow-y-auto">
            <div className="flex h-full w-8/12 flex-col gap-1 overflow-y-auto">
              <input
                className="rounded-lg border border-silver p-2 shadow-inner"
                placeholder="Search"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              ></input>
              <div
                className="flex h-full w-full flex-col gap-2 overflow-y-auto
                pt-2"
              >
                {filterUserList.map((item) => (
                  <CollapsableInfoCard
                    id={item._id}
                    key={`Member-${item._id}`}
                    title={`${item.rank != undefined ? item.rank : "N/R"}`}
                    titleAppendix={
                      <div className="-ml-1">{item.full_name} </div>
                    }
                    mainText={item.permissions.join("\n")}
                    updateFunc={updateFeedback}
                  />
                ))}
              </div>
            </div>
            <div
              className="mb-2 flex w-4/12 flex-col gap-1 overflow-y-auto
              rounded-lg border border-silver p-3 shadow-md"
            >
              <div
                className="bg-gradient-to-r from-deepOcean to-sky
                bg-clip-text text-3xl text-transparent"
              >
                List of Available Permissions
              </div>
              <div className="h-full overflow-y-auto pr-1">
                {permList.map((item) => (
                  <div className="">{item}</div>
                ))}
              </div>
            </div>
          </div>
        )}
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

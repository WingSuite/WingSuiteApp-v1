// React Icons
import { VscSearch } from "react-icons/vsc";
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
import { authCheck } from "@/utils/authCheck";
import { get, post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
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
        "/user/everyone/",
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
      var res = await get("/user/get_permissions_list/", Cookies.get("access"));

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

    // Convert search string to lower case for case-insensitive comparison
    const searchLower = search.toLowerCase();

    // Filter the filtered user list if the search bar changed
    setFilteredUserList(
      userList.filter(
        (item) =>
          item.multipurpose.toLowerCase().includes(searchLower) ||
          item.permissions.some((permission) =>
            permission.toLowerCase().includes(searchLower)
          )
      )
    );
  }, [search, userList]);

  // Update function
  const updateUser = (id, title, perms, rank) => {
    // Send API call for creating the feedback
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/update_permissions/",
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
          "/user/update_rank/",
          { id: id, rank: rank },
          Cookies.get("access")
        );

        // If the call was successful, send a success toaster
        if (res.status == "success") successToaster(`User's rank updated`);
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
              <div
                className="flex flex-row items-center gap-2 rounded-lg border
                border-silver p-2 shadow-inner"
              >
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <VscSearch />
                </IconContext.Provider>
                <input
                  className="w-full"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div
                className="flex h-full w-full flex-col gap-2 overflow-y-auto
                pt-2"
              >
                {search == "" && filterUserList.map((item) => (
                  <CollapsableInfoCard
                    id={item._id}
                    key={`Member-${item._id}`}
                    titleAppendix={
                      <div className="-ml-1">{item.full_name} </div>
                    }
                    mainText={
                      item.permissions.length == 0
                        ? ""
                        : item.permissions.join("\n")
                    }
                    updateFunc={updateUser}
                    simpleEditor={true}
                    tag={item.rank || "N/R"}
                    tagList={["N/R"]
                      .concat(config.rankList)
                      .reduce((obj, item) => {
                        obj[item] = "";
                        return obj;
                      }, {})}
                  />
                ))}
                {search != "" && filterUserList.map((item) => (
                  <CollapsableInfoCard
                    id={item._id}
                    key={`Member-${item._id}`}
                    titleAppendix={
                      <div className="-ml-1">{item.full_name} </div>
                    }
                    mainText={
                      item.permissions.length == 0
                        ? ""
                        : item.permissions.join("\n")
                    }
                    updateFunc={updateUser}
                    startState={true}
                    simpleEditor={true}
                    tag={item.rank || "N/R"}
                    tagList={["N/R"]
                      .concat(config.rankList)
                      .reduce((obj, item) => {
                        obj[item] = "";
                        return obj;
                      }, {})}
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

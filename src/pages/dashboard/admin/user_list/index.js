// React Icons
import { VscSearch, VscExtensions, VscListUnordered } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import { UserCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define useStates
  const [filterUserList, setFilteredUserList] = useState([]);
  const [actionTrigger, setActionTrigger] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipID, setTooltipID] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.user_list.page)) return;

    // Get the list of users
    (async () => {
      // Get the list of users
      var res = await post(
        "/user/everyone/",
        {
          page_size: 2000,
          page_index: 0,
          allow_permissions: true,
          allow_phone_number: true,
        },
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
          multipurpose: `${obj.rank != undefined ? obj.rank + ` ` : "N/T "}${
            obj.full_name
          }`,
        };
      });

      // Save the information to the userList useState
      setFilteredUserList(processed);
      setUserList(processed);
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

  // Handle when the mouse enters the cell
  const handleMouseEnter = (text, id) => {
    setTooltipContent(text);
    setTooltipID(id);
    setShowTooltip(true);
  };

  // Handle when the mouse leaves the cell
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Define the kick user action
  const kickUser = (id) => {
    // Run async call to process kick
    (async () => {
      // Call API
      var res = await post(
        "/auth/kick_user/",
        { id: id },
        Cookies.get("access")
      );

      // Show toast messages depending on state
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);

      // Trigger action trigger
      setActionTrigger(!actionTrigger);
    })();
  };

  // Card mode view
  const cardModeView = (
    <div className="flex flex-wrap gap-4 overflow-y-auto pt-2">
      {filterUserList.map((item) => (
        <UserCard
          id={item._id}
          key={`Member-${item._id}`}
          name={`${item.last_name}, ${item.first_name} ${
            item.middle_initial == undefined ? `` : item.middle_initial
          }`}
          rank={item.rank ? item.rank : "No Title"}
          email={item.email}
          phone={item.phone_number}
          deleteFunc={(id, _) => kickUser(id)}
        />
      ))}
    </div>
  );

  const listModeView = (
    <div className="max-w-screen overflow-y-auto pt-3">
      <table className="min-w-full divide-y table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="text-gray-600 text-left font-semibold uppercase
              tracking-wider "
            ></th>
            <th
              className="text-gray-600 pr-6 text-left font-semibold uppercase
              tracking-wider w-1/5"
            >
              Title
            </th>
            <th
              className="text-gray-600 pr-6 text-left font-semibold uppercase
              tracking-wider w-1/5"
            >
              Name
            </th>
            <th
              className="text-gray-600 pr-6 text-left font-semibold uppercase
              tracking-wider w-1/5"
            >
              Email
            </th>
            <th
              className="text-gray-600 pr-6 text-left font-semibold uppercase
              tracking-wider w-1/5"
            >
              Phone Number
            </th>
            <th
              className="text-gray-600 pr-6 text-left font-semibold uppercase
              tracking-wider w-1/5"
            >
              About Me
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filterUserList.map((item, idx) => (
            <tr
              key={item._id || idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-silver"}
            >
              <td
                className="text-gray-500 whitespace-nowrap pr-2 text-center
                text-sm"
              >
                {idx + 1}
              </td>
              <td className="text-gray-500 whitespace-nowrap pr-6 text-sm">
                {item.rank || "N/T"}
              </td>
              <td className="text-gray-500 whitespace-nowrap pr-6 text-sm">
                {item.full_name}
              </td>
              <td className="text-gray-500 whitespace-nowrap pr-6 text-sm">
                {item.email}
              </td>
              <td className="text-gray-500 whitespace-nowrap pr-6 text-sm">
                {item.phone_number}
              </td>
              <td
                className="text-gray-500 line-clamp-1 text-sm"
                onMouseEnter={() => handleMouseEnter(item.about_me, item._id)}
                onMouseLeave={handleMouseLeave}
              >
                {item.about_me}
              </td>
              {showTooltip && item._id == tooltipID && tooltipContent != "" && (
                <div
                  className="absolute z-10 rounded-md bg-white p-2
                  text-sm text-sky shadow-lg border border-silver mr-10"
                >
                  {tooltipContent}
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" customName="Admin / User List" />
        {userList.length == 0 ? (
          <Nothing
            mainText={"There are No Members in the Organization"}
            subText={"A tree falls in a forest, does it make a sound?"}
          />
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            <div className="mb-1 flex flex-row gap-4 pt-1.5">
              <div
                className="flex w-1/2 flex-row items-center gap-2 rounded-lg
                border border-silver p-2 shadow-inner"
              >
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <VscSearch />
                </IconContext.Provider>
                <input
                  className="w-full text-3xl"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="static">
                <button
                  className="absolute rounded-lg border border-silver p-3
                  shadow-md transition duration-200 ease-in
                  hover:-translate-y-[0.03rem] hover:border-sky
                  hover:shadow-sky"
                  onClick={() => setViewMode(!viewMode)}
                >
                  <IconContext.Provider value={{ size: "1.8em" }}>
                    {viewMode ? <VscListUnordered /> : <VscExtensions />}
                  </IconContext.Provider>
                </button>
              </div>
            </div>
            {!viewMode ? cardModeView : listModeView}
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

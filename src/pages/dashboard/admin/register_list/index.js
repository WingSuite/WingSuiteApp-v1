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
import { authCheck } from "@/utils/authCheck";
import { get, post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import { UserCard } from "@/components/cards";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Define useStates
  const [registerList, setRegisterList] = useState([]);
  const [actionTrigger, setActionTrigger] = useState(false);

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.register_list.page)) return;

    // Save the list of users who are registering to the organization
    (async () => {
      // Call end point to get the register list
      var res = await get(
        "/auth/get_register_requests/",
        Cookies.get("access")
      );

      // Save the register list
      setRegisterList(res.message);
    })();
  }, [actionTrigger]);

  // Define the authorize user action
  const authorizeUser = (id) => {
    // Run async call to process authorization
    (async () => {
      // Call API
      var res = await post(
        "/auth/authorize_user/",
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

  // Define the reject user action
  const rejectUser = (id) => {
    // Run async call to process authorization
    (async () => {
      // Call API
      var res = await post(
        "/auth/reject_user/",
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

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" customName="Admin / Register List" />
        {registerList.length == 0 ? (
          <Nothing
            mainText={"No One Has Signed Up..."}
            subText={"*Ribbit* *Ribbit* *Ribbit*"}
          />
        ) : (
          <div className="flex flex-wrap gap-4 overflow-y-auto pt-2">
            {registerList.map((item) => (
              <UserCard
                id={item._id}
                key={`Member-${item._id}`}
                name={`${item.last_name}, ${item.first_name} ${
                  item.middle_initial == undefined ? `` : item.middle_initial
                }`}
                rank={item.rank ? item.rank : "No Rank"}
                email={item.email}
                phone={item.phone_number}
                addFunc={(id, _) => authorizeUser(id)}
                deleteFunc={(id, _) => rejectUser(id)}
              />
            ))}
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

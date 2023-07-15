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

// Config imports
import { permissionsList } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { formatMilDate } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { BottomDropDown } from "@/components/dropdown";
import { CollapsableInfoCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import { UserCard } from "@/components/cards";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitMembersPage() {
  // Define useStates
  const [membersList, setMembersList] = useState([]);
  const [officersList, setOfficersList] = useState([]);

  // Define router and get unit ID from URL
  const router = useRouter();
  const { unit_id } = router.query;

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get unit ID mapping in reverse order
    const unitIDMap = JSON.parse(localStorage.getItem("unitIDMap"));
    let reversedMap = {};
    for (let key in unitIDMap) {
      reversedMap[unitIDMap[key]] = key;
    }

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
        if (res.status == "success") setMembersList(res.message);

        // Call API to get the units's member list
        var res = await post(
          "/unit/get_all_officers/",
          { id: reversedMap[unit_id] },
          Cookies.get("access")
        );

        // If the resulting information is successful, then set members list
        if (res.status == "success") setOfficersList(res.message);
      })();
    }
  }, [unit_id]);

  // Define the officer list section
  const officersDisplay = (
    <div className="flex flex-col gap-4">
      <div className="text-3xl">Officers</div>
      <div className="flex flex-wrap">
        {officersList.map((item) => (
          <UserCard
            name={item.rank ? item.rank + " " + item.full_name : item.full_name}
            email={item.email}
            phone={item.phone_number}
          />
        ))}
      </div>
    </div>
  );

  // Define the member list section
  const membersDisplay = (
    <div className="flex flex-col gap-4">
      <div className="text-3xl">Members</div>
      <div className="flex flex-wrap">
        {membersList.map((item) => (
          <UserCard
            name={item.rank ? item.rank + " " + item.full_name : item.full_name}
            email={item.email}
            phone={item.phone_number}
          />
        ))}
      </div>
    </div>
  );

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
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

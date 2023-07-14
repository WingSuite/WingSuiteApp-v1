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
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Component to define Warrior Knowledge chart and content
export default function WarriorKnowledgeView() {
  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Get the user's metric data
    (async () => {
      // // Call API to get the user's data
      // var res = await post(
      //   "/user/get_pfa_data/",
      //   { page_size: 2000, page_index: 0 },
      //   Cookies.get("access")
      // );

      // // Get the list of composite scores
      // var compositeScores = [];
      // for (let item of res.message) {
      //   compositeScores.push(item.composite_score);
      // }
    })();
  }, []);

  // Render component
  return(<>Warrior Knowledge View</>);
}
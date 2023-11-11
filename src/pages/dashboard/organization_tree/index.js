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

// Modal imports
import Modal from "react-modal";
import InspectUnitModal from "./_inspectModal";

// Util imports
import { authCheck } from "@/utils/authCheck";
import { processUnits } from "@/utils/tree";
import { post } from "@/utils/call";

// Config import
import { config } from "@/config/config";

// Custom components imports
import { errorToaster } from "@/components/toasters";
import { TreeChart } from "@/components/treeGraph";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// replace '#root' with '#__next' for Next.js
Modal.setAppElement("#__next");

// Unit member page definition
export default function UnitResourcesPage() {
  // Data useStates
  const [unitList, setUnitList] = useState([{ name: config.orgName }]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selection, setSelection] = useState({});

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.unit_handling.page)) return;

    // Call backend to fetch all unit data
    (async () => {
      // Call API endpoint to get unit data
      var res = await post(
        "/unit/get_all_units/",
        {
          page_size: 2000,
          page_index: 0,
          tree_format: true,
        },
        Cookies.get("access")
      );

      // Show error response status message
      if (res.status == "error") {
        errorToaster(res.message);
        return;
      }

      // Extract the unit list and process the unit list
      var units = res.message;

      // Save data
      setUnitList(units);
    })();
  }, []);

  console.log(unitList);

  // Define onClose function for closing modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" customName="Organization Tree" />
        <div
          className="tree-container rounded-lg border border-silver
          shadow-inner "
        >
          <TreeChart
            treeData={unitList}
            updateUnitFunc={(e) => {
              if (e.parent != undefined) {
                setModalIsOpen(true);
                setSelection(e);
              }
            }}
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => closeModal()}
            contentLabel="Example Modal"
            ariaHideApp={false}
            className="m-auto flex w-fit flex-col items-center border-0
            outline-none"
            overlayClassName="flex items-center justify-center bg-black
            bg-opacity-30 fixed inset-0 z-[999]"
          >
            {modalIsOpen && (
              <InspectUnitModal
                selection={selection}
                closeModal={closeModal}
              />
            )}
          </Modal>
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

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";

// Toaster Components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { endPointsList, permissionsList } from "@/config/config";

// Modal imports
import Modal from "react-modal";
import AddUnitModal from "../../../../helper/dashboard/admin/unit_handling/addModal";
import UpdateUnitModal from "../../../../helper/dashboard/admin/unit_handling/updateModal";

// Util imports
import { authCheck } from "@/utils/authCheck";
import { processUnits } from "@/utils/tree";
import { get, post } from "@/utils/call";

// Custom components imports
import { errorToaster, successToaster } from "@/components/toasters";
import { TreeChart } from "@/components/treeGraph";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Unit member page definition
export default function UnitResourcesPage() {
  // Data useStates
  const [unitList, setUnitList] = useState([{ name: "Detachment 025" }]);

  // Tracking and state useStates
  const [actionTrigger, setActionTrigger] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [unitTypeMap, setUnitTypeMap] = useState({});
  const [unitTypeMapR, setUnitTypeMapR] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);

  // Input tracking useStates
  const [selection, setSelection] = useState({});
  const [addOptions, setAddOptions] = useState({});
  const [editOptions, setEditOptions] = useState({});

  // Execute function on mount
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck(permissionsList.admin.unit_handling.page)) return;

    // Call backend to fetch all unit data
    (async () => {
      // Call API endpoint to get unit data
      var res = await post(
        endPointsList.admin.unit_handling.data[0],
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
      for (const item of units) processUnits(item);
      units.push({ name: "Add Unit" });
      units = [{ name: "Detachment 025", children: units }];

      // Save data
      setUnitList(units);
    })();

    // Call backend to fetch unit type data
    (async () => {
      // Call API endpoint to get unit type data
      var res = await get(
        endPointsList.admin.unit_handling.data[1],
        Cookies.get("access")
      );

      // Process the data
      res = res.message;

      // Save the mapping
      setUnitTypeMap(
        res.reduce((obj, item) => {
          obj[item.charAt(0).toUpperCase() + item.slice(1)] = item;
          return obj;
        }, {})
      );
      setUnitTypeMapR(
        res.reduce((obj, item) => {
          obj[item] = item.charAt(0).toUpperCase() + item.slice(1);
          return obj;
        }, {})
      );
    })();

    // Define the useState
    setAddOptions({
      name: "",
      unit_type: "",
      parent: "",
      children: [],
      officers: [],
      members: [],
    });
    setEditOptions({});
  }, [actionTrigger]);

  // Define function to update addOptions
  const updateAddOptions = (id, value) => {
    setAddOptions((prevState) => ({ ...prevState, [id]: value }));
  };

  // Define function to update editOptions
  const updateEditOptions = (id, value) => {
    setEditOptions((prevState) => ({ ...prevState, [id]: value }));
  };

  // Add unit function
  const addUnitFunction = () => {
    // Check that the name, or unit_type is not empty
    if (addOptions.name == "") {
      errorToaster("Unit name is empty");
      return;
    }
    if (addOptions.unit_type == "") {
      errorToaster("No unit type was specified");
      return;
    }

    // Do the API handling
    (async () => {
      // Generate a copy of the addOptions
      var copy = { ...addOptions };

      // Format the unit type information
      copy.unit_type = unitTypeMap[copy.unit_type];

      // Call API endpoint to get unit type data
      var res = await post(
        endPointsList.admin.unit_handling.add,
        copy,
        Cookies.get("access")
      );

      // Show toast messages depending on state
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);

      // Update useStates
      setActionTrigger(!actionTrigger);
      setModalIsOpen(false);
      setAddMode(false);
    })();
  };

  // Delete unit function
  const deleteUnitFunction = () => {
    // Do the API handling
    (async () => {
      // Call API endpoint to get unit type data
      var res = await post(
        endPointsList.admin.unit_handling.delete,
        { id: selection._id },
        Cookies.get("access")
      );

      // Show toast messages depending on state
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);

      // Trigger action trigger
      setActionTrigger(!actionTrigger);
      setModalIsOpen(false);
      setEditMode(false);
    })();
  };

  // Update unit function
  const updateUnitFunction = () => {
    // Do the API handling
    (async () => {
      // Call API endpoint to get unit type data
      var res = await post(
        endPointsList.admin.unit_handling.update,
        editOptions,
        Cookies.get("access")
      );

      // Show toast messages depending on state
      if (res.status == "error") errorToaster(res.message);
      if (res.status == "success") successToaster(res.message);

      // Trigger action trigger
      setActionTrigger(!actionTrigger);
      setModalIsOpen(false);
      setEditMode(false);
    })();
  };

  // Define onClose function for closing modal
  const closeModal = () => {
    setModalIsOpen(false);
    setAddOptions({
      name: "",
      unit_type: "",
      parent: "",
      children: [],
      officers: [],
      members: [],
    });
    setAddMode(false);
    setEditMode(false);
  };

  // Render page
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" customName="Admin / Unit Handling" />
        <div
          className="tree-container rounded-lg border border-silver
          shadow-inner "
        >
          <TreeChart
            treeData={unitList}
            addUnitFunc={(e) => {
              setModalIsOpen(true);
              setSelection(e);
              setAddMode(true);
            }}
            updateUnitFunc={(e) => {
              if (e.parent != undefined) {
                setModalIsOpen(true);
                setEditMode(true);
                setSelection(e);
                setEditOptions({
                  id: e._id,
                  parent: e.parent,
                  unit_type: e.unit_type,
                  name: e.name,
                });
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
            {addMode && (
              <AddUnitModal
                selection={selection}
                unitTypes={unitTypeMap}
                options={addOptions}
                updateOptions={updateAddOptions}
                addFunc={addUnitFunction}
                closeModal={closeModal}
              />
            )}
            {editMode && (
              <UpdateUnitModal
                selection={selection}
                unitTypes={unitTypeMap}
                unitTypesR={unitTypeMapR}
                options={editOptions}
                updateOptions={updateEditOptions}
                updateFunc={updateUnitFunction}
                deleteFunc={deleteUnitFunction}
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

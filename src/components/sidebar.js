// React Icons
import { VscOrganization, VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { MdLogout } from "react-icons/md";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// JS Cookies import
import Cookies from "js-cookie";

// Custom imports
import { regularSidebarContents, unitSidebarConfig } from "@/config/config";

// Util imports
import { permissionsCheck } from "@/utils/permissionCheck";
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Image
import logo from "../../public/logo.png";

// Login Page definitions
const Sidebar = () => {
  // Define useStates
  const [fullName, setFullName] = useState("");
  const [unitCollapse, setUnitCollapse] = useState({});
  const [units, setUnits] = useState([]);

  // Get current path and router
  const router = useRouter();
  const currentPath = usePathname();

  // On mount of the Next.js page
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;
    
    // Fetch the first and last name of the user from local storage
    const user = JSON.parse(localStorage.getItem("whoami"));

    // Set the full name of the user
    setFullName(user.full_name);

    // Get the user's units
    (async () => {
      // Set temp variable
      let rawUnits = {};
      let collapses = {};

      // If the user has the admin permissions, grant that user all access
      if (permissionsCheck([], user.permissions)) {
        // Set availableUnits to all units
        var res = await post(
          "/unit/get_all_units/",
          { page_size: 2000, page_index: 0 },
          Cookies.get("access")
        );

        // Process available units
        for (let item of res.message) {
          rawUnits[item.name] = item._id;
          collapses[item.name] = false;
        }

        // Set the processed units and collapse trackers of the user
        setUnitCollapse(collapses);
        setUnits(rawUnits);

        // Return
        return;
      }

      // Iterate through the user's units
      for (let item of user["units"]) {
        // Get the iterate unit's data
        const unitData = await post(
          "/unit/get_unit_info/",
          { id: item },
          Cookies.get("access")
        );

        // Track changes
        rawUnits[unitData.message.name] = unitData.message._id;
        collapses[unitData.message.name] = false;
      }

      // Set the processed units and collapse trackers of the user
      setUnitCollapse(collapses);
      setUnits(rawUnits);
    })();

    // Send the user to the login page if ever the
  }, []);

  // Render the Logo
  const sidebarLogo = (
    <div
      className="mx-4 mb-10 mt-5 flex flex-row items-center
      gap-2 text-sm text-white"
    >
      <div>
        <Image alt="Logo" src={logo} width={90} height={90} />
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-thin">WingSuite</div>
        <div className="text-sm font-thin">Detachment 025</div>
      </div>
    </div>
  );

  // Render the items list
  const menuList = regularSidebarContents.map((item) => (
    <button
      key={`${item.title.toLowerCase()}`}
      className={`${
        currentPath == `${item.link}`
          ? `bg-white hover:-translate-y-[0.1rem] hover:shadow-md
          hover:shadow-white`
          : `border border-transparent hover:-translate-y-[0.1rem]
          hover:border-white hover:shadow-lg hover:shadow-sky`
      }
    	flex w-10/12 items-center justify-start
      rounded-lg px-2 py-1 transition duration-200 ease-in`}
      onClick={() => router.push(`${item.link}`)}
    >
      <IconContext.Provider
        value={{
          color: currentPath == `${item.link}` ? "#000000" : "#FFFFFF",
          size: "1.2em",
          className: "mr-2",
        }}
      >
        {item.icon}
      </IconContext.Provider>
      <div
        className={`text-${
          currentPath == `${item.link}` ? "black" : "white"
        } text-left text-sm`}
      >
        {item.title}
      </div>
    </button>
  ));

  // Render the units list
  const unitList = Object.keys(units).map((item) => (
    <div className="flex w-10/12 flex-col gap-2" key={`${item}`}>
      <button
        className={`${
          currentPath.includes(encodeURIComponent(item))
            ? `bg-white hover:-translate-y-[0.1rem] hover:shadow-md
            hover:shadow-white`
            : `border border-transparent hover:-translate-y-[0.1rem]
            hover:border-white hover:shadow-lg hover:shadow-sky`
        }
        flex w-full items-center justify-start
        rounded-lg px-2 py-1 transition duration-200 ease-in`}
        onClick={() =>
          setUnitCollapse((prevState) => ({
            ...prevState,
            [item]: !prevState[item],
          }))
        }
      >
        <div className="flex w-full flex-row truncate pr-1">
          <IconContext.Provider
            value={{
              color: currentPath.includes(encodeURIComponent(item))
                ? "#000000"
                : "#FFFFFF",
              size: "1.2em",
              className: "mr-2",
            }}
          >
            <VscOrganization />
          </IconContext.Provider>
          <div
            className={`text-${
              currentPath.includes(encodeURIComponent(item)) ? "black" : "white"
            } truncate text-left text-sm`}
          >
            {item}
          </div>
        </div>
        <IconContext.Provider
          value={{
            size: "1.2em",
            color: currentPath.includes(encodeURIComponent(item))
              ? "#000000"
              : "#FFFFFF",
          }}
        >
          {unitCollapse[item] ||
          currentPath.includes(encodeURIComponent(item)) ? (
            <VscChevronDown />
          ) : (
            <VscChevronUp />
          )}
        </IconContext.Provider>
      </button>
      {(unitCollapse[item] ||
        currentPath.includes(encodeURIComponent(item))) && (
        <div className="ml-6 flex flex-col gap-2">
          {unitSidebarConfig.map((sidebarItem) => (
            <button
              key={`${item}-${sidebarItem.title}`}
              className={`${
                currentPath.includes(encodeURIComponent(item)) &&
                currentPath.includes(sidebarItem.link)
                  ? `bg-white hover:-translate-y-[0.1rem] hover:shadow-md
                  hover:shadow-white`
                  : `border border-transparent hover:-translate-y-[0.1rem]
                  hover:border-white hover:shadow-lg hover:shadow-sky`
              }
              flex w-full items-center justify-start rounded-lg px-2 py-1
              transition duration-200 ease-in`}
              onClick={() =>
                router.push(`/dashboard/unit/${item}${sidebarItem.link}`)
              }
            >
              <IconContext.Provider
                value={{
                  color:
                    currentPath.includes(encodeURIComponent(item)) &&
                    currentPath.includes(sidebarItem.link)
                      ? "#000000"
                      : "#FFFFFF",
                  size: "1.2em",
                  className: "mr-2",
                }}
              >
                {sidebarItem.icon}
              </IconContext.Provider>
              <div
                className={`text-${
                  currentPath.includes(encodeURIComponent(item)) &&
                  currentPath.includes(sidebarItem.link)
                    ? "black"
                    : "white"
                } text-sm`}
              >
                {sidebarItem.title}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  ));

  // Function to logout
  const logoutButton = () => {
    // Process logout
    (async () => {
      post(
        "/auth/signout/",
        { access: Cookies.get("access"), refresh: Cookies.get("refresh") },
        Cookies.get("access")
      );
    })();

    // Wipe localStorage and cookies
    localStorage.setItem("unitIDMap", "{}");
    localStorage.setItem("whoami", "{}");
    Cookies.set("access", "");
    Cookies.set("refresh", "");

    // Move to login page
    router.push('/login');
  };

  // Component return
  return (
    <div
      className="h-full min-w-[18rem] bg-gradient-to-tr from-deepOcean
      to-sky drop-shadow-xl"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="grid justify-items-center overflow-hidden">
          {sidebarLogo}
          <div
            className="flex w-full flex-col items-center gap-2
            overflow-y-auto pb-4 pt-2"
          >
            {menuList}
            {unitList}
          </div>
        </div>
        <div className="mt-5 flex flex-col">
          <div
            className="mx-4 mb-4 flex flex-row items-center gap-3
            rounded-xl bg-white py-2 pl-3 pr-1"
          >
            <div className="h-[2.3rem] w-[2.3rem] rounded-full bg-silver" />
            <div className="flex-1 truncate text-sm">{fullName}</div>
            <button onClick={logoutButton}>
              <IconContext.Provider
                value={{
                  color: "#fc3535",
                  size: "1.5em",
                  className: "mr-2",
                }}
              >
                <MdLogout />
              </IconContext.Provider>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Dashboard page
export default Sidebar;

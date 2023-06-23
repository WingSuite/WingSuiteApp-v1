// React Icons
import { VscHome } from "react-icons/vsc";
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
import { sidebarContents } from "@/config/config";

// Image
import logo from "../../public/logo.png";

// Login Page definitions
const Sidebar = () => {
  // Create useState for the full name of the user
  const [fullName, setFullName] = useState();

  // Get current path and router
  const router = useRouter();
  const currentPath = usePathname();

  // On mount of the Next.js page
  useEffect(() => {
    // Fetch the first and last name of the user from local storage
    const localData = JSON.parse(localStorage.getItem("whoami"));

    // Set the full name of the user
    setFullName(localData["full_name"]);
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
  const menuList = sidebarContents.map((item) => (
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
        } text-sm`}
      >
        {item.title}
      </div>
    </button>
  ));

  // Component return
  return (
    <div
      className="from-deepOcean h-full w-[18rem] bg-gradient-to-tr
      to-sky drop-shadow-xl"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="grid justify-items-center overflow-hidden">
          {sidebarLogo}
          <div
            className="flex w-full flex-col items-center gap-2
            overflow-y-auto pt-2"
          >
            {menuList}
          </div>
        </div>
        <div className="mt-5 flex flex-col">
          <div
            className="mx-4 mb-4 flex flex-row items-center gap-2
            rounded-xl bg-white px-3 py-2"
          >
            <div className="h-[2.3rem] w-[2.3rem] rounded-full bg-silver" />
            <div className="flex-1 truncate text-sm">{fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Dashboard page
export default Sidebar;

// React Icons
import { 
	VscHome, 
} from 'react-icons/vsc';
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import React from "react";
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// JS Cookies import
import Cookies from 'js-cookie';

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

	// List of items for the sidebar
	const menuItems = [
		{
			title: "Homepage",
			link: "/dashboard/homepage",
			icon: <VscHome/>
		}
	];

	// Render the items list
	const menuList = menuItems.map(item => (
		<button 
			key={`${item.title.toLowerCase()}`} 
			className={
				`${(currentPath == `${item.link}`) ? 
				"bg-white hover:-translate-y-[0.2rem] hover:shadow-md hover:shadow-white" 
				: 
				"hover:bg-silver hover:-translate-y-[0.2rem] hover:shadow-md hover:shadow-silver"} 
				flex justify-start items-center rounded-lg transition ease-in duration-200 px-3 py-2 my-1 mx-2 w-10/12`
			} 
			onClick={() => router.push(`${item.link}`)}
		>
			<IconContext.Provider value={{color: (currentPath == `${item.link}`) ? "#000000" : "#FFFFFF", size: "1.2em", className: "mr-2"}}>
				{item.icon}
			</IconContext.Provider>
			<div className={`text-${(currentPath == `${item.link}`) ? "black" : "white"} text-sm`}>
				{item.title}
			</div>
		</button>
	));

	// Component return
	return (
		<div className="bg-gradient-to-tr from-blue1 to-sky h-full w-[18rem] drop-shadow-xl">
			<div className="h-full flex flex-col justify-between">
				<div className="grid justify-items-center">
					<div className="flex flex-row items-center text-white text-sm mx-4 mt-5 mb-10 gap-2">
						<div>
							<Image
								alt="Logo"
								src={logo}
								width={90}
								height={90}
							/>
						</div>
						<div className="flex flex-col">
							<div className="text-3xl font-thin">
								WingSuite
							</div>
							<div className="text-sm font-thin">
								Detachment 025
							</div>
						</div>
						
					</div>
					{menuList}
				</div>
				<div className='flex flex-col'>
					<div className="flex flex-row items-center rounded-xl bg-white mb-4 mx-4 px-3 py-2 gap-2">
						<div className='w-[2.3rem] h-[2.3rem] bg-silver rounded-full'>
						</div>
						<div className="flex-1 text-sm truncate">
							{fullName}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Export the Dashboard page
export default Sidebar;
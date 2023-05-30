// React Icons
import { 
	VscHome, 
} from 'react-icons/vsc';
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import React from "react";
import Image from 'next/image'
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

// JS Cookies import
import Cookies from 'js-cookie';

// Image
import logo from "../../public/logo.png";

// Login Page definitions
const Sidebar = ({ }) => {
	// Get current path and router
	const router = useRouter();
	const currentPath = usePathname();

	// List of items for the sidebar
	const menuItems = [
		{
			title: "Homepage",
			link: "/dashboard/homepage",
			icon: <VscHome/>
		}
	];

	console.log(currentPath)

	// Render the items list
	const menuList = menuItems.map(item => (
		<button 
			key={`${item.title.toLowerCase()}`} 
			className={
				`${(currentPath == `${item.link}`) ? 
				"bg-white hover:-translate-y-[0.1rem] hover:shadow-md hover:shadow-white" 
				: 
				"hover:bg-silver hover:-translate-y-[0.1rem] hover:shadow-md hover:shadow-silver"} 
				px-3 py-2 my-1 mx-2 w-10/12 flex justify-start items-center rounded-lg`
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
		<div className="bg-gradient-to-tr from-blue1 to-sky h-full w-2/12 drop-shadow-xl">
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
						<div className='w-9 h-9 bg-silver rounded-full'>
							
						</div>
						<div className="text-black text-sm">
							{`${Cookies.get('lastName')}, ${Cookies.get('firstName')}`}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Export the Dashboard page
export default Sidebar;
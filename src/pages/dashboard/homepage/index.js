// React Icons
import { VscBellSlash, VscCloseAll } from "react-icons/vsc";

// React.js & Next.js libraries
import React from "react";
import { useState, useEffect } from "react";

// Custom Imports
import { ButtonCard, StatCard } from "@/components/cards";
import { config, testData } from "@/config/config";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pagetitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function Home() {
  // Create useState for the last name of the user
  const [lastName, setLastName] = useState();

  // On mount of the Next.js page
  useEffect(() => {
    // Fetch the last name of the user from local storage
    const localData = JSON.parse(localStorage.getItem("whoami"));

    // Set the last name of the user
    setLastName(localData["last_name"]);
  }, []);

  // Get the greeting information
  const date = new Date();
  const hours = date.getHours();
  let greeting;

  // Get the greeting
  if (hours < 12) greeting = `Good Morning C/${lastName} 🌞`;
  else if (hours < 17) greeting = `Good Afternoon C/${lastName} 🌇`;
  else greeting = `Good Evening C/${lastName} 🌃`;

  // Week View definition
  // TODO: Get the Events System to work dynamically
  // TODO: Solve system design for cascading events (Wing -> Flights)
  const weekView = (
    <div className="flex flex-col gap-6">
      <div className="text-4xl">This Week's View</div>
      <div className="flex flex-row justify-between">
        {config.daysOfTheWeek.map((item) => (
          <div
            className="flex h-64 w-52 flex-col gap-2 rounded-lg border border-silver p-2
            shadow-lg"
          >
            <div className="text-lg">{item}</div>
            {testData.weekView[item].map((item) => (
              <ButtonCard
                size="lg"
                text={item.name}
                subtext={item.datetime}
                buttonInfo={`transition duration-200 ease-in border
                border-transparent hover:border hover:border-black
                hover:-translate-y-[0.1rem] hover:shadow-xl ${
                  config.eventColorMap[item.name]
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Quick Links view definition
  const quickLinksView = (
    <div className="flex flex-col gap-6">
      <div className="text-4xl">Quick Links</div>
      <div className="flex h-full flex-col justify-between">
        {config.quickLinks.map((item) => (
          <ButtonCard
            size="xl"
            text={item.name}
            buttonInfo="transition duration-200 ease-in border border-silver
            hover:-translate-y-[0.1rem] hover:shadow-lg hover:border-black p-2"
          />
        ))}
      </div>
    </div>
  );

  // Stats view definition
  // TODO: Connect Gebauer's API implementations to this system
  const statsView = (
    <div className="flex h-full w-fit flex-1 flex-col gap-6">
      <div className="text-4xl">Stats</div>
      <div className="flex h-full flex-col justify-around">
        <StatCard keyContent="Last PFA Score" valueContent="N/A" />
        <StatCard keyContent="Last WK Score" valueContent="N/A" />
      </div>
    </div>
  );

  // Feedback view definition
  // TODO: Dynamically call for the past few feedback's information
  const feedbackView = (
    <div className="flex w-1/4 flex-col gap-6">
      <div className="text-4xl">Feedback</div>
      <div
        className="flex h-full flex-col gap-4 rounded-lg border
      border-silver p-1 shadow-inner"
      >
        <Nothing
          icon={<VscCloseAll/>}
          mainText="No Feedback Provided"
          subText="You Kept Up Standards"
        />
      </div>
    </div>
  );

  // Notifications view definition
  // TODO: Work on the notifications section for each unit a person is in
  const notificationsView = (
    <div className="flex w-1/3 flex-col gap-6">
      <div className="text-4xl">Notifications</div>
      <div
        className="flex h-full flex-col gap-4 rounded-lg border
      border-silver p-1 shadow-inner"
      >
        <Nothing
          icon={<VscBellSlash/>}
          mainText="No Notifications So Far"
          subText="Get Some Rest"
        />
      </div>
    </div>
  );

  // Render components
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
        <div className="flex h-full flex-col gap-14">
          <div className="text-8xl">{greeting}</div>
          {weekView}
          <div className="flex h-full flex-row gap-14">
            {statsView}
            {feedbackView}
            {notificationsView}
            {quickLinksView}
          </div>
        </div>
      </div>
    </div>
  );
}

// React Icons
import { VscBellSlash, VscCloseAll } from "react-icons/vsc";

// React.js & Next.js libraries
import React from "react";
import { useState, useEffect } from "react";

// JS Cookies import
import Cookies from "js-cookie";

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
  const [feedback, setFeedback] = useState([]);

  // On mount of the Next.js page
  useEffect(() => {
    // Fetch the last name of the user from local storage
    const localData = JSON.parse(localStorage.getItem("whoami"));

    // Set the last name of the user
    setLastName(localData["last_name"]);

    // Get the user's feedback information
    fetch("http://127.0.0.1:5000/user/get_feedback/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("access")}`,
      },
      body: JSON.stringify({
        page_size: 3,
        page_index: 0,
      }),
    })
      .then((results) => results.json())
      .then((data) => {
        // Iterate through each item of the response and store just the quotes
        let quotes = [];
        for (let item of data.message) {
          quotes.push([item.feedback, item.from_user]);
        }

        // Store the quotes to the useState
        setFeedback(quotes);
      });
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
    <div className="flex flex-col gap-4">
      <div className="text-4xl">This Week's View</div>
      <div className="flex flex-row justify-between">
        {config.daysOfTheWeek.map((item) => (
          <div
            key={`weekView-${item}`}
            className="flex h-64 w-52 flex-col gap-2 rounded-lg border
            border-silver p-2 shadow-lg"
          >
            <div className="text-lg">{item}</div>
            {testData.weekView[item].map((event) => (
              <ButtonCard
                key={`weekViewEvent-${event.name}`}
                size="lg"
                text={event.name}
                subtext={event.datetime}
                buttonInfo={`transition duration-200 ease-in border
                border-transparent hover:border hover:border-black
                hover:-translate-y-[0.1rem] hover:shadow-xl bg-gradient-to-tr
                from-blue1 to-sky text-white`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Quick Links view definition
  const quickLinksView = (
    <div className="flex flex-col gap-4">
      <div className="text-4xl">Quick Links</div>
      <div className="flex h-full flex-col justify-between">
        {config.quickLinks.map((item) => (
          <ButtonCard
            key={`quickLink-${item.name}`}
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
    <div className="flex h-full w-fit flex-1 flex-col gap-4">
      <div className="text-4xl">Stats</div>
      <div className="flex h-full flex-col justify-around">
        <StatCard keyContent="Last PFA Score" valueContent="N/A" />
        <StatCard keyContent="Last WK Score" valueContent="N/A" />
      </div>
    </div>
  );

  // Feedback view definition
  const feedbackView = (
    <div className="flex w-1/4 flex-col gap-4 overflow-auto">
      <div className="text-4xl">Feedback</div>
      <div
        className="flex max-h-full flex-col gap-4 overflow-auto rounded-lg
        pr-1"
      >
        {feedback.length === 0 ? (
          <Nothing
            icon={<VscCloseAll />}
            mainText="No Feedback Provided"
            subText="You Kept Up Standards"
          />
        ) : (
          feedback.map((info) => (
            <div
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-blue1 to-sky px-2 py-1"
            >
              <div className="text-lg italic text-white ">"{info[0]}"</div>
              <div className="font-bold text-white">- C/{info[1]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Notifications view definition
  // TODO: Work on the notifications section for each unit a person is in
  const notificationsView = (
    <div className="flex w-1/3 flex-col gap-4">
      <div className="text-4xl">Notifications</div>
      <div className="flex h-full flex-col gap-4 rounded-lg p-1">
        <Nothing
          icon={<VscBellSlash />}
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
        <div className="flex h-full flex-col gap-14 overflow-auto">
          <div className="pt-2 text-8xl">{greeting}</div>
          {weekView}
          <div className="flex h-full flex-row gap-14 overflow-auto">
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

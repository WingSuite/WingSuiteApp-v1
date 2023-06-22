// React Icons
import { VscBellSlash, VscCloseAll } from "react-icons/vsc";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from 'next/router';

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { config } from "@/config/config";

// Util imports
import { getTimeBounds, formatMilitary } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { ButtonCard, StatCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pagetitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function Home() {
  // Create useState for the last name of the user
  const [lastName, setLastName] = useState();
  const [feedbackData, setFeedbackData] = useState([]);
  const [weekViewData, setWeekViewData] = useState(
    config.daysOfTheWeek.reduce((obj, key) => {
      obj[key] = [];
      return obj;
    }, {})
  );

  // Get router
  const router = useRouter();

  // On mount of the Next.js page
  useEffect(() => {
    // Fetch the last name of the user from local storage
    const localData = JSON.parse(localStorage.getItem("whoami"));

    // Set the last name of the user
    setLastName(localData["last_name"]);

    // Process feedback information
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/get_feedback/",
        { page_size: 3, page_index: 0 },
        Cookies.get("access")
      );

      // Iterate through each item of the response and store just the quotes
      let quotes = [];
      for (let item of res.message) {
        var from_user = await post(
          "/user/get_user/",
          { id: item.from_user },
          Cookies.get("access")
        );
        quotes.push([item.feedback, from_user.message.full_name]);
      }

      // Store the quotes to the useState
      setFeedbackData(quotes);
    })();

    // Process current week's events
    (async () => {
      // Initialize data for parsing
      let resultWeekData = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      // Get the start and end bounds
      const [start, end] = getTimeBounds();

      // Get the user's feedback information
      var res = await post(
        "/user/get_events/",
        { start_datetime: start, end_datetime: end },
        Cookies.get("access")
      );

      // Iterate through the list of raw data
      for (let item of res.message) {
        // Get datetime information
        const date = new Date(item.start_datetime * 1000);
        let dayOfWeek = date.getDay();

        // Change the day index
        if (dayOfWeek === 0) dayOfWeek = 6;
        else dayOfWeek -= 1;

        // Add new information to resultWeekData
        resultWeekData[config.daysOfTheWeek[dayOfWeek]].push({
          name: item.name,
          start: item.start_datetime,
          end: item.end_datetime,
        });
      }

      // Set week view data
      setWeekViewData(resultWeekData);
    })();
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
  const weekView = (
    <div className="flex flex-col gap-4">
      <div className="text-4xl">This Week's View</div>
      <div className="flex flex-row justify-between">
        {config.daysOfTheWeek.map((item, index) => (
          <div
            key={`weekView-${item}-${index}`}
            className="flex h-64 w-52 flex-col gap-2 rounded-lg border
            border-silver p-2 shadow-lg"
          >
            <div className="text-lg">{item}</div>
            {weekViewData[item].map((event, index) => (
              <ButtonCard
                key={`weekViewEvent-${event.name}-${index}`}
                size="lg"
                text={event.name}
                subtext={`${formatMilitary(event.start)}-${formatMilitary(
                  event.end
                )}`}
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
        {config.quickLinks.map((item, index) => (
          <ButtonCard
            key={`quickLink-${item.name}-${index}`}
            size="xl"
            text={item.name}
            action={() => {router.push(item.link)}}
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
        px-1 pr-2"
      >
        {feedbackData.length === 0 ? (
          <Nothing
            icon={<VscCloseAll />}
            mainText="No Feedback Provided"
            subText="You Kept Up Standards"
          />
        ) : (
          feedbackData.map((info, index) => (
            <div
              key={`feedbackView-${index}`}
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-blue1 to-sky px-2 py-1 shadow-lg"
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

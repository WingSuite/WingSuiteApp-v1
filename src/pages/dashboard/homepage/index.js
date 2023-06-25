// React Icons
import { VscBellSlash, VscCloseAll } from "react-icons/vsc";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { config } from "@/config/config";

// Util imports
import { getTimeBounds, formatMilTime, getTodayDay } from "@/utils/time";
import { post } from "@/utils/call";

// Custom components imports
import { ButtonCard, StatCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function HomePage() {
  // Create useState for the last name of the user
  const [lastName, setLastName] = useState("");
  const [rank, setRank] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [notifications, setNotifications] = useState([]);
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

    // Get the last name and rank of the user
    setLastName(localData["last_name"]);
    if ("rank" in localData) setRank(localData["rank"] + " ");

    // Process feedback information
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/get_feedbacks/",
        { page_size: 3, page_index: 0, sent: false },
        Cookies.get("access")
      );

      // If resulting API results in an error, return
      if (res.status === "error") return;

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

    // Process notification data
    (async () => {
      // Get notification trim length
      const trim = config.notificationPreviewTrimLength;

      // Get the start and end bounds
      const start = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      const end = Math.floor(Date.now() / 1000);

      // Get the user's feedback information
      var res = await post(
        "/user/get_notifications/",
        { start_datetime: start, end_datetime: end },
        Cookies.get("access")
      );

      // Get every notification and store their name and message
      let notificationData = [];
      for (let item of res.message) {
        // Clip text if it is more than 200 characters long
        var text = item.notification;
        text = text.length > trim ? text.substring(0, trim) + "..." : text;

        // Append information
        notificationData.push([item.name, text]);
      }

      // Set the notification data
      setNotifications(notificationData);
    })();
  }, []);

  // Get the greeting information
  const date = new Date();
  const hours = date.getHours();
  let greeting;

  // Get the greeting
  if (hours < 12) greeting = `Good Morning ${rank}${lastName} 🌞`;
  else if (hours < 17) greeting = `Good Afternoon ${rank}${lastName} 🌇`;
  else greeting = `Good Evening ${rank}${lastName} 🌃`;

  // Week View definition
  const weekView = (
    <div className="flex flex-col gap-4">
      <div className="text-4xl">This Week's View</div>
      <div className="flex h-full flex-row justify-between px-1">
        {config.daysOfTheWeek.map((item, index) => (
          <div
            key={`weekView-${item}-${index}`}
            className={`flex h-56 w-[13.5%] flex-col gap-2 rounded-lg border p-2
            ${
              getTodayDay() == item
                ? "border-2 border-sky shadow-md shadow-sky"
                : "border-silver shadow-lg"
            }`}
          >
            <div className="text-lg">{item}</div>
            {weekViewData[item].map((event, index) => (
              <ButtonCard
                key={`weekViewEvent-${event.name}-${index}`}
                size="lg"
                text={event.name}
                subtext={`${formatMilTime(event.start)}-${formatMilTime(
                  event.end
                )}`}
                buttonInfo={`transition duration-200 ease-in border
                border-transparent hover:border hover:border-darkOcean
                hover:border hover:-translate-y-[0.1rem] hover:shadow-xl
                bg-gradient-to-tr from-deepOcean to-sky text-white`}
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
      <div
        className="flex h-full flex-col gap-4 overflow-auto
        p-1 pb-4"
      >
        {config.quickLinks.map((item, index) => (
          <ButtonCard
            key={`quickLink-${item.name}-${index}`}
            size="2xl"
            text={item.name}
            action={() => {
              router.push(item.link);
            }}
            buttonInfo="h-20 transition duration-200 ease-in border
            border-silver hover:-translate-y-[0.1rem] hover:shadow-lg
            hover:border-black p-2"
          />
        ))}
      </div>
    </div>
  );

  // Stats view definition
  // TODO: Connect Gebauer's API implementations to this system
  const statsView = (
    <div className="flex h-full flex-1 flex-col gap-4">
      <div className="text-4xl">Stats</div>
      <div
        className="flex h-full flex-col gap-4 overflow-auto px-1
        pb-4"
      >
        <StatCard keyContent="Last PFA Score" valueContent="N/A" />
        <StatCard keyContent="Last WK Score" valueContent="N/A" />
      </div>
    </div>
  );

  // Feedback view definition
  const feedbackView = (
    <div className="flex h-full w-1/4 flex-col gap-4">
      <div className="text-4xl">Feedback</div>
      <div
        className="flex h-full flex-col gap-4 overflow-auto rounded-lg
        px-1 pr-2 pb-4"
      >
        {feedbackData.length === 0 ? (
          <Nothing
            icon={<VscCloseAll />}
            mainText="No Feedback Provided"
            subText="Keep Up the Good Work"
          />
        ) : (
          feedbackData.map((info, index) => (
            <div
              key={`feedbackView-${index}`}
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-deepOcean to-sky px-2 py-1 shadow-lg"
            >
              <div className="text-xl italic text-white ">"{info[0]}"</div>
              <div className="font-bold text-white">- {info[1]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Notifications view definition
  const notificationsView = (
    <div className="flex w-1/3 flex-col gap-4">
      <div className="text-4xl">Notifications</div>
      <div
        className="flex h-full flex-col gap-4 overflow-auto rounded-lg px-1
        pr-2 pb-4"
      >
        {notifications.length === 0 ? (
          <Nothing
            icon={<VscBellSlash />}
            mainText="No Notifications So Far"
            subText="Get Some Rest"
          />
        ) : (
          notifications.map((info, index) => (
            <div
              key={`feedbackView-${index}`}
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-deepOcean to-sky px-2 py-1 shadow-lg"
            >
              <div className="text-2xl font-bold text-white">{info[0]}</div>
              <div className="text-base text-white">{info[1]}</div>
            </div>
          ))
        )}
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
          <div className="pt-2 text-7xl">{greeting}</div>
          {weekView}
          <div className="flex h-full flex-row gap-14 overflow-hidden">
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

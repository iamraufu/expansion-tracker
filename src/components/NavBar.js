import React, { useState } from "react";
import userProfileIcon from "../assets/icons/user.png";
import hamburger from "../assets/icons/hamburger.svg";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import dailyActivityTrackerIcon from "../assets/icons/dailyActivityTrackerIcon.png";
import siteStoreIcon from "../assets/icons/siteStoreIcon.png";
import reportsIcon from "../assets/icons/reportsIcon.png";
import ActiveTaskIcon from "../assets/icons/activeTaskIcon.png";
import HistoryIcon from "../assets/icons/historyIcon.png";
// import reportsIcon from "../assets/icons/reportsIcon.png";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  // const { pathname } = useLocation();
  const pathname = "dashboard";
  const [isSideBarOpen,setIsSideBarOpen] = useState(false)

  const SideNavLinkObj = [
    {
      text: "Partner Acquisition",
      icon: partnerAcquisitionIcon,
      path: "/partners",
    },

    {
      text: "DailyActivity Tracker",
      icon: dailyActivityTrackerIcon,
      innerLinks: [
        {
          text: "Active Task",
          icon: ActiveTaskIcon,
          path: "/activeTask",
        },
        {
          text: "History",
          icon: HistoryIcon,
          path: "/history",
        },
      ],
      path: "/dailyActivityTracker",
    },
    {
      text: "Site Status",
      icon: siteStoreIcon,
      path: "/dailyActivityTracker",
    },
    {
      text: "Reports",
      icon: reportsIcon,
      path: "/dailyActivityTracker",
    },
  ];

  const NavLinkItem = ({ to, icon: Icon, text, isactivex, innerLinks }) => (
    <>
      <NavLink
        to={to}
        className={`flex rounded-md hover:text-primary text-white py-5 pr-5 items-center justify-start  gap-4 ${
          isactivex ? "activex" : ""
        }`}
      >
        <img src={Icon} alt={text} className="w-5 h-5 " />
        <div
          className={`font-medium  font-poppins  whitespace-nowrap`}
        >
          {text}
        </div>
      </NavLink>
        <ul>

        {innerLinks &&
            innerLinks.map((item) => (
                <li className="last:half-a-border-on-top border-l  border-slate-50 ml-2 ">
                    <NavLink
                        to={item.path}
                        className={`relative flex  hovernav text-sm hover:text-primary text-white py-5 px-5 items-center justify-start  gap-4 ${
                        isactivex ? "activex" : ""
                        }`}
                    >
                        <div className="w-4 h-[1px] bg-slate-50 absolute left-0"></div>
            
                        <img src={item.icon} alt={item.text} className="w-5 h-5 ml-2" />
                        <div
                        className={`font-medium  font-poppins  whitespace-nowrap`}
                        >
                        {item.text}
                        </div>
                    </NavLink>
                </li>
            ))}
        </ul>
    </>
  );

  console.log(isSideBarOpen);

  return (
    <header className="sticky  z-40 top-0 text-sm">
      <div className="padding-x   py-4 w-full bg-primary">
        <nav className="w-full flex justify-between items-center container max-container">
          <div className="flex justify-center items-center gap-4 text-white">
            <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                <img src={hamburger} alt="hamburger icon" className="w-6 " />
            </button>
            <p className="uppercase font-medium font-poppins  text-base">
              Expansion Tracker
            </p>
          </div>
          <img
            src={userProfileIcon}
            alt="profileIcon"
            className="w-8 "
          />
        </nav>
      </div>
      <div onClick={() => setIsSideBarOpen(!isSideBarOpen)} className={`absolute   ${isSideBarOpen?"block w-full h-screen bg-black/10": "hidden"}`}></div>
      <div className={`h-screen z-30 bg-secondary absolute    ${isSideBarOpen?"left-0": "-left-96"} padding-x transition-all duration-200`}>
        <ul className="mt-4 ">
          {/* <p className={`px-3  text-base text-gray-400 font-medium`}>Pages</p> */}
          {SideNavLinkObj.map((item, index) => (
            <NavLinkItem
              key={index}
              to={item.path}
              icon={item.icon}
              text={item.text}
              isactivex={pathname === item.path}
              innerLinks={item.innerLinks}
            />
          ))}
        </ul>
      </div>
    </header>
  );
};

export default NavBar;

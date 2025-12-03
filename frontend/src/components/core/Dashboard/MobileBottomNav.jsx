import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";
import * as Icons from "react-icons/vsc"; 
import { useSelector } from "react-redux";

const MobileBottomNavbar = () => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  // Filter only links that match user role or have no type
  const filteredLinks = sidebarLinks.filter(
    (link) => !link.type || link.type === user?.role
  );

  const newLink = { 
    id: 7,
    name: "Settings",
    path: "/dashboard/settings",
    icon: "VscSettingsGear",
  }

  filteredLinks.push(newLink);

  return (
    <div className="
      fixed bottom-0 left-0 right-0 
      bg-richblack-800 border-t border-richblack-700 
      md:hidden z-50 flex justify-around py-2
    ">
      {filteredLinks.map((item) => {
        const Icon = Icons[item.icon];
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            className="flex flex-col items-center relative w-full"
          >
            {/* Animated Highlight Circle */}
            <div
              className={`
                absolute -top-5 w-10 h-10 rounded-full transition-all duration-300
                ${isActive ? "bg-white shadow-[0_0_20px_rgba(255,215,0,0.45)] scale-110" : "scale-0"}
              `}
            ></div>

            {/* Icon */}
            <Icon
              className={`
                text-xl transition-all duration-300 
                ${isActive ? "text-yellow-200 scale-140 -translate-y-2.5" : "text-richblack-300 scale-100"}
              `}
            />

            {/* Label */}
            <span
              className={`
                text-[10px] mt-1 transition-all duration-300
                ${isActive ? "text-yellow-50 font-semibold" : "text-richblack-300"}
              `}
            >
              {item.name}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNavbar;

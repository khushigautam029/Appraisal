import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  Target,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import logo from "../assets/logo.png";

const ManagerSidebar = () => {
  const menu = [
    {
      name: "Dashboard",
      path: "/manager-dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Team Overview",
      path: "/team",
      icon: <Users size={18} />,
    },
    {
      name: "Assign Targets",
      path: "/assign-targets",
      icon: <Target size={18} />,
    },
    {
      name: "Review Appraisals",
      path: "/review-appraisal",
      icon: <ClipboardCheck size={18} />,
    },
    {
      name: "Reports",
      path: "/manager-reports",
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div
      className="
        w-64 h-screen
        bg-gradient-to-b from-blue-50 via-white to-indigo-50
        border-r border-blue-100
        flex flex-col
        shadow-2xl
      "
    >
      {/* HEADER */}
      <div
        className="
          h-20 flex items-center gap-3 px-2 border-b border-gray-200
          bg-white/70 backdrop-blur-md
          shadow-sm
        "
      >
        <div
          className="
            p-1 rounded-full
            bg-white shadow-md
            border border-blue-100
          "
        >
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>

        <div>
          <h1 className="text-blue-900 text-sm font-bold tracking-wide">
            Appraisal System
          </h1>

          <p className="text-[10px] text-gray-500">
            Manager Panel
          </p>
        </div>
      </div>

      {/* MENU */}
      <ul className="flex-1 px-3 py-5 space-y-3 overflow-y-auto">
        {menu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3
                rounded-2xl
                text-xs font-medium
                transition-all duration-300
                shadow-sm
                ${
                  isActive
                    ? `
                      bg-gradient-to-r from-blue-500 to-indigo-500
                      text-white
                      shadow-lg
                      scale-[1.02]
                    `
                    : `
                      bg-white/80
                      text-gray-700
                      hover:bg-blue-100
                      hover:text-blue-700
                      hover:shadow-md
                    `
                }
              `
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* FOOTER */}
      <div className="p-4 border-t border-blue-100">
        <div
          className="
            bg-white/80
            rounded-2xl
            p-3
            shadow-md
            text-center
          "
        >
        </div>
      </div>
    </div>
  );
};

export default ManagerSidebar;
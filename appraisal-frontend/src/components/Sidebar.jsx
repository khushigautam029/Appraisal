import { useState } from "react";
import {
  FaBookOpen,
  FaBullseye,
  FaChartBar,
  FaChevronDown,
  FaChevronRight,
  FaClipboardCheck,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome size={15} />,
    },
    {
      name: "Self Appraisal",
      path: "/self-appraisal",
      icon: <FaClipboardCheck size={15} />,
    },
    {
      name: "Targets",
      path: "/targets",
      icon: <FaBullseye size={15} />,
    },
    {
      name: "Appraisal Report",
      path: "/report",
      icon: <FaChartBar size={15} />,
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
            Employee Panel
          </p>
        </div>
      </div>

      {/* MENU */}
      <ul className="flex-1 px-3 py-5 space-y-3 overflow-y-auto">

        {/* INTRODUCTION */}
        <li>
          <div
            onClick={() => setOpen(!open)}
            className="
              flex justify-between items-center
              px-4 py-3
              rounded-2xl
              bg-white/80
              shadow-sm
              cursor-pointer
              hover:bg-blue-100
              transition-all duration-300
            "
          >
            <span className="text-xs font-semibold text-gray-700">
              Introduction
            </span>

            {open ? (
              <FaChevronDown size={12} className="text-gray-500" />
            ) : (
              <FaChevronRight size={12} className="text-gray-500" />
            )}
          </div>

          {open && (
            <ul className="mt-3 ml-2 space-y-2">

              <li>
                <NavLink
                  to="/guidelines"
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
                  <FaBookOpen size={15} />
                  <span>Guidelines</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/sample-appraisal"
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
                  <FaClipboardList size={15} />
                  <span>Sample Appraisal</span>
                </NavLink>
              </li>

            </ul>
          )}
        </li>

        {/* MAIN MENU */}
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

export default Sidebar;
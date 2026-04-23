import { useState } from "react";
import {
  FaBookOpen,
  FaChartBar,
  FaChevronDown,
  FaChevronRight,
  FaClipboardList
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const activeClass = "bg-blue-600 text-white font-semibold shadow-sm";
  const normalClass = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">

      {/* 🔥 HEADER (Logo + Name) */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">

        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 object-cover rounded-full border mr-0"
        />

        <h1 className="text-blue-800 text-lg font-bold ">
          Appraisal System
        </h1>
      </div>

      {/* 🔥 MENU */}
      <ul className="p-3 text-sm space-y-2 flex-1 overflow-y-auto">

        {/* 🔹 INTRODUCTION */}
        <li>
          <div
            onClick={() => setOpen(!open)}
            className="flex justify-between items-center p-2 cursor-pointer rounded hover:bg-gray-100"
          >
            <span className="font-medium text-gray-700">
              Introduction
            </span>
            {open ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </div>

          {open && (
            <ul className="ml-3 mt-2 space-y-1">

              <li>
                <NavLink
                  to="/guidelines"
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded transition ${
                      isActive ? activeClass : normalClass
                    }`
                  }
                >
                  <FaBookOpen size={14} /> Guidelines
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/sample-appraisal"
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded transition ${
                      isActive ? activeClass : normalClass
                    }`
                  }
                >
                  <FaClipboardList size={14} /> Sample Appraisal
                </NavLink>
              </li>

            </ul>
          )}
        </li>

        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? activeClass : normalClass
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Self Appraisal */}
        <li>
          <NavLink
            to="/self-appraisal"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? activeClass : normalClass
              }`
            }
          >
            Self Appraisal
          </NavLink>
        </li>

        {/* Targets */}
        <li>
          <NavLink
            to="/targets"
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? activeClass : normalClass
              }`
            }
          >
            Targets
          </NavLink>
        </li>

        {/* Report */}
        <li>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition ${
                isActive ? activeClass : normalClass
              }`
            }
          >
            <FaChartBar size={14} /> Appraisal Report
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
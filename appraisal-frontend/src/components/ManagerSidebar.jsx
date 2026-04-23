import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const ManagerSidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/manager-dashboard" },
    { name: "Team Overview", path: "/team" },
    { name: "Assign Targets", path: "/assign-targets" },
    { name: "Review Appraisals", path: "/review-appraisal" },
    { name: "Reports", path: "/manager-reports" },
  ];

  const activeClass = "bg-blue-600 text-white font-semibold shadow-sm";
  const normalClass = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">

      {/* 🔥 HEADER (Logo + Name) */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">

        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 object-cover rounded-full border"
        />

        <h1 className="text-blue-800 text-lg font-bold ">
          Appraisal System
        </h1>
      </div>

      {/* 🔥 MENU */}
      <ul className="p-3 space-y-2 text-sm flex-1 overflow-y-auto">

        {menu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition ${
                  isActive ? activeClass : normalClass
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}

      </ul>

    </div>
  );
};

export default ManagerSidebar;
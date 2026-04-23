import {
    FaBuilding,
    FaCalendarPlus,
    FaChartBar,
    FaClipboardCheck,
    FaUserPlus,
    FaUsers
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const HrSidebar = () => {

    const activeClass = "bg-blue-600 text-white font-semibold shadow-sm";
    const normalClass = "text-gray-600 hover:bg-gray-100";

    return (
        <div className="w-64 bg-white border-r h-screen flex flex-col">

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
            <ul className="p-3 text-sm space-y-2 flex-1 overflow-y-auto">

                {/* Dashboard */}
                <li>
                    <NavLink
                        to="/hr-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaChartBar size={14} /> Dashboard
                    </NavLink>
                </li>

                {/* Add Employee */}
                <li>
                    <NavLink
                        to="/add-employee"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaUserPlus size={14} /> Add Employee
                    </NavLink>
                </li>

                {/* Managers */}
                <li>
                    <NavLink
                        to="/managers"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaUsers size={14} /> Managers
                    </NavLink>
                </li>

                {/* Departments */}
                <li>
                    <NavLink
                        to="/departments"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaBuilding size={14} /> Departments
                    </NavLink>
                </li>

                {/* Create Cycle */}
                <li>
                    <NavLink
                        to="/create-cycle"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaCalendarPlus size={14} /> Create Cycle
                    </NavLink>
                </li>

                {/* Manager Reviews */}
                <li>
                    <NavLink
                        to="/manager-appraisals"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-lg transition ${isActive ? activeClass : normalClass
                            }`
                        }
                    >
                        <FaClipboardCheck size={14} /> Reviews
                    </NavLink>
                </li>

            </ul>
        </div>
    );
};

export default HrSidebar;
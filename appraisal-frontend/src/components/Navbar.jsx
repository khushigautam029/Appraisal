import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { getNotifications } from "../services/notificationService";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const role = localStorage.getItem("role");
  const actualRole = localStorage.getItem("actualRole");
  const userId = localStorage.getItem("userId");

  const user = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(userId, role);

      const data = Array.isArray(response)
        ? response
        : response?.data
        ? response.data
        : [];

      setNotifications(data);

      const unread = Array.isArray(data)
        ? data.filter((n) => !n.read).length
        : 0;

      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [role]);

  // OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      className="
        sticky top-0 z-50
        bg-white/80 backdrop-blur-md
        border-b border-blue-100
        px-6 py-3
        flex justify-end items-center
        shadow-md
      "
    >
      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* ROLE SWITCH */}
        {actualRole === "MANAGER" && role === "MANAGER" && (
          <button
            onClick={() => {
              localStorage.setItem("role", "EMPLOYEE");
              window.location.href = "/sample-appraisal";
            }}
            className="
              text-xs font-medium
              px-4 py-2
              rounded-full
              bg-gradient-to-r from-blue-100 to-indigo-100
              text-blue-700
              shadow-sm
              hover:shadow-md
              hover:scale-105
              transition-all duration-300
            "
          >
            Employee Mode
          </button>
        )}

        {actualRole === "MANAGER" && role === "EMPLOYEE" && (
          <button
            onClick={() => {
              localStorage.setItem("role", "MANAGER");
              window.location.href = "/manager-dashboard";
            }}
            className="
              text-xs font-medium
              px-4 py-2
              rounded-full
              bg-gradient-to-r from-green-100 to-emerald-100
              text-green-700
              shadow-sm
              hover:shadow-md
              hover:scale-105
              transition-all duration-300
            "
          >
            Manager Mode
          </button>
        )}

        {/* NOTIFICATIONS */}
        <div
          onClick={() => navigate("/notifications")}
          className="
            relative cursor-pointer
            w-11 h-11
            rounded-2xl
            bg-white
            flex items-center justify-center
            shadow-md
            hover:shadow-lg
            hover:bg-blue-50
            transition-all duration-300
          "
        >
          <FaBell className="text-gray-600 text-[17px]" />

          {unreadCount > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                min-w-[18px] h-[18px]
                px-1
                flex items-center justify-center
                bg-red-500
                text-white
                text-[10px]
                rounded-full
                shadow
              "
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-3
              px-3 py-2
              rounded-2xl
              bg-white
              shadow-md
              cursor-pointer
              hover:shadow-lg
              hover:bg-blue-50
              transition-all duration-300
            "
          >
            <FaUserCircle className="text-3xl text-blue-600" />

            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-800">
                {user.name}
              </p>

              <p className="text-[10px] text-gray-500">
                {role}
              </p>
            </div>

            <FaChevronDown className="text-[10px] text-gray-500" />
          </div>

          {/* DROPDOWN */}
          {open && (
            <div
              className="
                absolute right-0 mt-3
                w-72
                bg-white/95 backdrop-blur-md
                border border-blue-100
                rounded-3xl
                shadow-2xl
                overflow-hidden
                animate-fadeIn
              "
            >
              {/* USER INFO */}
              <div
                className="
                  px-5 py-4
                  bg-gradient-to-r from-blue-50 to-indigo-50
                  border-b border-blue-100
                "
              >
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-4xl text-blue-600" />

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* MENU */}
              <div className="p-3 space-y-2">

                <button
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-3
                    rounded-2xl
                    text-xs font-medium
                    text-gray-700
                    hover:bg-blue-100
                    hover:text-blue-700
                    transition-all duration-300
                  "
                >
                  <FaCog />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-3
                    rounded-2xl
                    text-xs font-medium
                    text-red-500
                    hover:bg-red-50
                    transition-all duration-300
                  "
                >
                  <FaSignOutAlt />
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
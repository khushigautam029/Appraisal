import { useEffect, useRef, useState } from "react";
import {
    FaBell,
    FaChevronDown,
    FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../services/notificationService";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(userId, role);
      // Ensure data is an array
      const data = Array.isArray(response) ? response : (response?.data ? response.data : []);
      setNotifications(data);

      const unread = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
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

  // ✅ Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b px-6 py-2 flex justify-end items-center shadow-sm sticky top-0 z-50">

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* 🔁 ROLE SWITCH */}
        {actualRole === "MANAGER" && role === "MANAGER" && (
          <button
            onClick={() => {
              localStorage.setItem("role", "EMPLOYEE");
              window.location.href = "/sample-appraisal";
            }}
            className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            Switch to Employee
          </button>
        )}

        {actualRole === "MANAGER" && role === "EMPLOYEE" && (
          <button
            onClick={() => {
              localStorage.setItem("role", "MANAGER");
              window.location.href = "/manager-dashboard";
            }}
            className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
          >
            Manager Mode
          </button>
        )}

        {/* 🔔 NOTIFICATIONS */}
        <div
          onClick={() => navigate("/notifications")}
          className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition"
        >
          <FaBell className="text-gray-600 text-lg" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => {
              setOpen(!open);
              setShowSettings(false);
            }}
            className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user.name}
            </span>
            <FaChevronDown className="text-xs text-gray-500" />
          </div>

          {/* 🔽 DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg overflow-hidden">

              {!showSettings ? (
                <>
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* OPTIONS */}
                  <div className="flex flex-col text-sm">
                    <div
                      onClick={() => {
                        navigate("/settings");
                        setOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                    >
                      Settings
                    </div>

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 space-y-3 text-sm">

                  <p className="font-semibold">Change Password</p>

                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full border px-2 py-1.5 rounded"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border px-2 py-1.5 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border px-2 py-1.5 rounded"
                  />

                  <button className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition">
                    Update Password
                  </button>

                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-xs text-blue-500"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
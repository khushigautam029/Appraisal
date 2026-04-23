import {
    FaBell,
    FaPalette,
    FaShieldAlt,
    FaUserLock
} from "react-icons/fa";

const Settings = () => {

  const user = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
  };

  return (
    <div className="p-1 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🔒 PROFILE (READ ONLY) */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-2 mb-4">
            <FaUserLock className="text-blue-600" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-4">
            <input
              value={user.name}
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            <input
              value={user.email}
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            <p className="text-xs text-gray-400">
              * Profile details are managed by HR/Admin
            </p>
          </div>
        </div>

        {/* 🔐 SECURITY */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-2 mb-4">
            <FaShieldAlt className="text-red-500" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
              Update Password
            </button>
          </div>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-2 mb-4">
            <FaBell className="text-yellow-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked />
              Email Notifications
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked />
              In-App Notifications
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Weekly Summary Report
            </label>
          </div>
        </div>

        {/* 🎨 PREFERENCES */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-2 mb-4">
            <FaPalette className="text-purple-500" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Dark Mode
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked />
              Auto Save Appraisal
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
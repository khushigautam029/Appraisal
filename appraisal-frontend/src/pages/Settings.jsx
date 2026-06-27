import {
  FaBell,
  FaCheckCircle,
  FaPalette,
  FaShieldAlt,
  FaUserLock,
} from "react-icons/fa";

const Settings = () => {
  const user = {
    name: localStorage.getItem("userName") || "User",
    email:
      localStorage.getItem("userEmail") ||
      "user@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-4 md:p-6">

      {/* 🔥 HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, security, and preferences
        </p>
      </div>

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🔒 PROFILE */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">

          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">

              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-2xl shadow-lg text-white">
                <FaUserLock />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Profile
                </h2>

                <p className="text-xs text-gray-500">
                  Read only information
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Full Name
                </label>

                <input
                  value={user.name}
                  disabled
                  className="w-full mt-1 bg-slate-100 border border-slate-200 p-3 rounded-2xl text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Email Address
                </label>

                <input
                  value={user.email}
                  disabled
                  className="w-full mt-1 bg-slate-100 border border-slate-200 p-3 rounded-2xl text-gray-600 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-xs">
                <FaCheckCircle />
                Profile details are managed by HR/Admin
              </div>

            </div>
          </div>
        </div>

        {/* 🔐 SECURITY */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">

          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">

              <div className="bg-gradient-to-br from-red-500 to-pink-400 p-3 rounded-2xl shadow-lg text-white">
                <FaShieldAlt />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Security
                </h2>

                <p className="text-xs text-gray-500">
                  Update your password securely
                </p>
              </div>
            </div>

            <div className="space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-slate-200 p-3 rounded-2xl bg-white/70 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-slate-200 p-3 rounded-2xl bg-white/70 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-slate-200 p-3 rounded-2xl bg-white/70 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />

              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-medium shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                Update Password
              </button>

            </div>
          </div>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">

          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">

              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-3 rounded-2xl shadow-lg text-white">
                <FaBell />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h2>

                <p className="text-xs text-gray-500">
                  Customize alerts and updates
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">

              <label className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-gray-700">
                  Email Notifications
                </span>

                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-gray-700">
                  In-App Notifications
                </span>

                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-gray-700">
                  Weekly Summary Report
                </span>

                <input type="checkbox" />
              </label>

            </div>
          </div>
        </div>

        {/* 🎨 PREFERENCES */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6">

          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">

              <div className="bg-gradient-to-br from-purple-500 to-pink-400 p-3 rounded-2xl shadow-lg text-white">
                <FaPalette />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Preferences
                </h2>

                <p className="text-xs text-gray-500">
                  Personalize your experience
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">

              <label className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-gray-700">
                  Dark Mode
                </span>

                <input type="checkbox" />
              </label>

              <label className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <span className="text-gray-700">
                  Auto Save Appraisal
                </span>

                <input type="checkbox" defaultChecked />
              </label>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { getActiveCycle } from "../services/cycleService";
import {
  getNotifications,
  markAsRead,
} from "../services/notificationService";

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [virtualDeadlineNotes, setVirtualDeadlineNotes] =
    useState([]);

  // 🔁 CHECK DEADLINES
  const checkDeadlines = async () => {
    const cycle = await getActiveCycle();
    if (!cycle) return;

    const now = new Date();
    const end = new Date(cycle.endDate);

    if (
      now >= end ||
      end - now < 7 * 24 * 60 * 60 * 1000
    ) {
      setVirtualDeadlineNotes([
        {
          id: "virtual_deadline",
          message: `Deadline Reminder: Appraisal Cycle '${cycle.name}' ends on ${cycle.endDate}.`,
          type: "WARNING",
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      setVirtualDeadlineNotes([]);
    }
  };

  // 🔁 FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");

      const data = await getNotifications(
        userId,
        role
      );

      setNotifications(data || []);
      setLoading(false);

      const unreadCount = [
        ...virtualDeadlineNotes,
        ...(data || []),
      ].filter((n) => !n.read).length;

      if (setNotificationCount) {
        setNotificationCount(unreadCount);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔁 AUTO REFRESH
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    checkDeadlines();

    const interval = setInterval(() => {
      fetchNotifications();
      checkDeadlines();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 🔁 MARK READ
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  // 🎨 ICONS
  const getIcon = (type) => {
    switch (type) {
      case "SUCCESS":
        return (
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl shadow-sm">
            <FaCheck />
          </div>
        );

      case "WARNING":
        return (
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-2xl shadow-sm">
            <FaExclamationTriangle />
          </div>
        );

      default:
        return (
          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl shadow-sm">
            <FaInfoCircle />
          </div>
        );
    }
  };

  const allNotifications = [
    ...virtualDeadlineNotes,
    ...notifications,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-4 md:p-6">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl text-white shadow-lg">
              <FaBell />
            </div>

            Notifications
          </h3>

          <p className="text-sm text-gray-500 mt-2 ml-1">
            Stay updated with appraisal alerts and updates
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-white shadow-lg rounded-2xl px-4 py-3 text-sm">
          <span className="text-gray-500">
            Total Notifications
          </span>

          <h3 className="text-xl font-bold text-blue-600">
            {allNotifications.length}
          </h3>
        </div>
      </div>

      {/* 🔥 MAIN CARD */}
      <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl shadow-2xl overflow-hidden">

        {/* TOP BAR */}
        <div className="bg-gradient-to-r from-blue-100 via-cyan-100 to-sky-100 px-6 py-4 border-b border-blue-100">

          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-blue-600" />

            <h2 className="font-semibold text-gray-800">
              Recent Notifications
            </h2>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-[400px]">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

              <p className="text-gray-500 mt-4 text-sm">
                Loading notifications...
              </p>
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">

              <div className="bg-blue-100 p-5 rounded-full text-blue-600 text-3xl shadow-md">
                <FaBell />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-700">
                No Notifications
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                You're all caught up 🎉
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {allNotifications.map((note) => (
                <div
                  key={note.id}
                  className={`group flex justify-between items-start gap-4 px-6 py-5 transition-all duration-300 ${
                    !note.read
                      ? "bg-blue-50/60"
                      : "hover:bg-slate-50"
                  }`}
                >

                  {/* LEFT */}
                  <div className="flex items-start gap-4 flex-1">

                    {getIcon(note.type)}

                    <div className="flex-1">
                      <p
                        className={`text-sm leading-6 ${
                          !note.read
                            ? "font-semibold text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        {note.message}
                      </p>

                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(
                          note.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* BUTTON */}
                  {!note.read &&
                    note.id !== "virtual_deadline" && (
                      <button
                        onClick={() =>
                          handleMarkAsRead(note.id)
                        }
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                      >
                        Mark as Read
                      </button>
                    )}

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Notifications;
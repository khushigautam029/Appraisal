import { useEffect, useState } from "react";
import { FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { getActiveCycle } from "../services/cycleService";
import { getNotifications, markAsRead } from "../services/notificationService";

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [virtualDeadlineNotes, setVirtualDeadlineNotes] = useState([]);


  // 🔁 CHECK DEADLINES
  const checkDeadlines = async () => {
    const cycle = await getActiveCycle();
    if (!cycle) return;

    const now = new Date();
    const end = new Date(cycle.endDate);

    if (now >= end || (end - now) < (7 * 24 * 60 * 60 * 1000)) {
      setVirtualDeadlineNotes([{
        id: "virtual_deadline",
        message: `Deadline Reminder: Appraisal Cycle '${cycle.name}' ends on ${cycle.endDate}.`,
        type: "WARNING",
        read: false,
        createdAt: new Date().toISOString()
      }]);
    } else {
      setVirtualDeadlineNotes([]);
    }
  };

  // 🔁 FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role"); // MUST EXIST

      const data = await getNotifications(userId, role);

      setNotifications(data || []);
      setLoading(false);

      // ✅ COUNT UNREAD
      const unreadCount =
        [...virtualDeadlineNotes, ...(data || [])].filter(n => !n.read).length;

      // 🔥 send count to parent (navbar badge)
      if (setNotificationCount) {
        setNotificationCount(unreadCount);
      }

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // 🔁 AUTO REFRESH EVERY 10 SEC
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    checkDeadlines();

    const interval = setInterval(() => {
      fetchNotifications();
      checkDeadlines();
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  // MARK AS READ
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications(); // refresh UI + count
  };

  const getIcon = (type) => {
    switch (type) {
      case "SUCCESS":
        return <FaCheck className="text-green-500" />;
      case "WARNING":
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const allNotifications = [...virtualDeadlineNotes, ...notifications];

  return (
    <div className="p-1">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3 p-1">
        <FaBell className="text-gray-600 text-xl" />
        <h2 className="text-xl font-semibold">
          All Notifications
        </h2>
      </div>

      {/* LIST */}
      <div className="bg-white rounded shadow min-h-[300px]">

        {loading ? (
          <p className="p-4 text-gray-500">Loading notifications...</p>
        ) : allNotifications.length === 0 ? (
          <p className="p-4 text-gray-500">No new notifications.</p>
        ) : (
          allNotifications.map((note) => (
            <div
              key={note.id}
              className={`p-4 border-b flex justify-between items-center transition ${!note.read ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getIcon(note.type)}</div>

                <div>
                  <p className={`text-sm ${!note.read ? "font-semibold text-gray-900" : "text-gray-700"
                    }`}>
                    {note.message}
                  </p>

                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!note.read && note.id !== "virtual_deadline" && (
                <button
                  onClick={() => handleMarkAsRead(note.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Notifications;
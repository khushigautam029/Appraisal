import { useEffect, useState, useRef } from "react";
import {
	FaCheck,
	FaExclamationTriangle,
	FaInfoCircle,
	FaTimes,
} from "react-icons/fa";
import {
	getUnreadNotifications,
	markAsRead,
} from "../services/notificationService";

const NotificationPopupManager = () => {
	const [popups, setPopups] = useState([]);

	const intervalRef = useRef(null);
	useEffect(() => {
		// [NotificationPopupManager] Mounted log removed
		const fetchPopups = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const role = localStorage.getItem("role");
				if (!userId) {
					console.warn("⚠️ userId not found in localStorage");
					return;
				}
				if (!role) {
					console.warn("⚠️ role not found in localStorage");
					return;
				}
				// 🔔 NotificationPopupManager: Fetching unread notifications log removed
				const unread = await getUnreadNotifications(userId, role);
				// Ensure unread is an array
				const notificationsArray = Array.isArray(unread)
					? unread
					: unread?.data
						? unread.data
						: [];
				setPopups(notificationsArray);
			} catch (error) {
				console.error(
					"❌ Error fetching notifications in NotificationPopupManager:",
					error,
				);
			}
		};

		fetchPopups();
		if (!intervalRef.current) {
			intervalRef.current = setInterval(fetchPopups, 30000);
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	const handleDismiss = async (id) => {
		try {
			await markAsRead(id);
			setPopups((prev) => prev.filter((p) => p.id !== id));
		} catch (error) {
			console.error("❌ Error marking notification as read:", error);
		}
	};

	if (popups.length === 0) return null;

	return (
		<div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
			{popups.map((popup) => (
				<div
					key={popup.id}
					className="bg-white rounded-lg shadow-xl border-l-4 border-blue-500 p-4 min-w-[300px] max-w-[400px] flex items-start gap-3 animate-slide-up relative"
				>
					<div className="mt-1 flex-shrink-0">
						{popup.type === "SUCCESS" && (
							<FaCheck className="text-green-500 text-lg" />
						)}
						{popup.type === "WARNING" && (
							<FaExclamationTriangle className="text-yellow-500 text-lg" />
						)}
						{(!popup.type || popup.type === "INFO") && (
							<FaInfoCircle className="text-blue-500 text-lg" />
						)}
					</div>
					<div className="flex-1 pr-6">
						<p className="text-sm font-semibold text-gray-800 break-words">
							{popup.message}
						</p>
						<p className="text-xs text-gray-400 mt-1">
							{new Date(popup.createdAt).toLocaleTimeString()}
						</p>
					</div>
					<button
						onClick={() => handleDismiss(popup.id)}
						className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
					>
						<FaTimes />
					</button>
				</div>
			))}
		</div>
	);
};

export default NotificationPopupManager;

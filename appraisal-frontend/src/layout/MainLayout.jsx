import { Outlet } from "react-router-dom";
import HrSidebar from "../components/HrSidebar";
import ManagerSidebar from "../components/ManagerSidebar";
import Navbar from "../components/Navbar";
import NotificationPopupManager from "../components/NotificationPopupManager";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const role = localStorage.getItem("role");

  const renderSidebar = () => {
    if (!role) return null;

    const upperRole = role.toUpperCase();

    if (upperRole.includes("HR")) return <HrSidebar />;
    if (upperRole.includes("MANAGER")) return <ManagerSidebar />;
    if (upperRole.includes("EMPLOYEE")) return <Sidebar />;

    return null;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* Sidebar */}
      <div className="shadow-2xl z-20">
        {renderSidebar()}
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* Navbar */}
        <Navbar />

        <NotificationPopupManager />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="
            bg-white/80
            backdrop-blur-md
            rounded-3xl
            shadow-xl
            border border-white/40
            min-h-full
            p-5
          ">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
import { Outlet } from "react-router-dom";
import HrSidebar from "../components/HrSidebar";
import ManagerSidebar from "../components/ManagerSidebar";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NotificationPopupManager from "../components/NotificationPopupManager";

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
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      {renderSidebar()}

      <div className="flex-1 flex flex-col relative">
        <Navbar />
        <NotificationPopupManager />

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default MainLayout;
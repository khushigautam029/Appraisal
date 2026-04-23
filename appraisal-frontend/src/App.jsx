import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AppraisalReport from "./pages/AppraisalReport";
import Dashboard from "./pages/Dashboard";
import EmployeeAppraisal from "./pages/EmployeeAppraisal";
import GuidelinePage from "./pages/GuidelinePage";
import AddEmployee from "./pages/hr/AddEmployee";
import CreateCycle from "./pages/hr/CreateCycle";
import DepartmentManagement from "./pages/hr/DepartmentManagement";
import HrDashboard from "./pages/hr/HrDashboard";
import ManagerAppraisalReview from "./pages/hr/ManagerAppraisalReview";
import Managers from "./pages/hr/Managers"; // ✅ IMPORT
import Login from "./pages/Login";
import AssignTargets from "./pages/manager/AssignTargets";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerReports from "./pages/manager/ManagerReports";
import ReviewAppraisal from "./pages/manager/ReviewAppraisal";
import TeamOverview from "./pages/manager/TeamOverview";
import MyTargets from "./pages/MyTargets";
import Notifications from "./pages/Notifications";
import SelfAppraisal from "./pages/SelfAppraisal";
import Settings from "./pages/Settings";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem("login") === "true",
	);

	const role = localStorage.getItem("role");

	return (
		<BrowserRouter>
			<Routes>
				{/* LOGIN */}
				<Route
					path="/login"
					element={<Login setIsLoggedIn={setIsLoggedIn} />}
				/>

				{/* PROTECTED ROUTES */}
				{isLoggedIn ? (
					<Route path="/" element={<MainLayout />}>
						{/* 🔥 DEFAULT REDIRECTION */}
						<Route
							index
							element={
								role === "EMPLOYEE" ? (
									<Navigate to="sample-appraisal" />
								) : role === "MANAGER" ? (
									<Navigate to="manager-dashboard" />
								) : role === "HR" ? (
									<Navigate to="hr-dashboard" />
								) : (
									<Navigate to="/login" />
								)
							}
						/>

						{/* ================= EMPLOYEE ================= */}
						<Route path="guidelines" element={<GuidelinePage />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="sample-appraisal" element={<EmployeeAppraisal />} />
						<Route path="self-appraisal" element={<SelfAppraisal />} />
						<Route path="targets" element={<MyTargets />} />
						<Route path="report" element={<AppraisalReport />} />
						<Route path="notifications" element={<Notifications />} />
						<Route path="settings" element={<Settings />} />

						{/* ================= MANAGER ================= */}
						<Route path="manager-dashboard" element={<ManagerDashboard />} />
						<Route path="team" element={<TeamOverview />} />
						<Route path="assign-targets" element={<AssignTargets />} />
						<Route path="review-appraisal" element={<ReviewAppraisal />} />
						<Route path="manager-reports" element={<ManagerReports />} />

						{/* ================= HR ================= */}
						<Route path="hr-dashboard" element={<HrDashboard />} />
						<Route path="add-employee" element={<AddEmployee />} />
						<Route path="managers" element={<Managers />} />
						<Route path="departments" element={<DepartmentManagement />} />
						<Route
							path="manager-appraisals"
							element={<ManagerAppraisalReview />}
						/>
						<Route path="create-cycle" element={<CreateCycle />} />
						{/* <Route path="/users" element={<Users />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/edit-user/:id" element={<AddEmployee />} /> */}
					</Route>
				) : (
					<Route path="*" element={<Navigate to="/login" />} />
				)}
			</Routes>
		</BrowserRouter>
	);
}

export default App;

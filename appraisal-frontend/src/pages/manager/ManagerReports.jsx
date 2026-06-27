import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import {
    FaChartBar,
    FaCheckCircle,
    FaFileExcel,
    FaSearch,
    FaStar,
    FaUsers
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { getAllCycles } from "../../services/cycleService";
import { getReports } from "../../services/managerService";

const ManagerReports = () => {
    const [selectedCycleId, setSelectedCycleId] = useState("");
    const [cycles, setCycles] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const location = useLocation();

    useEffect(() => {
        fetchCycles();
    }, []);

    const fetchCycles = async () => {
        try {
            const res = await getAllCycles();
            const data = res.data || [];

            setCycles(data);

            const active = data.find(
                (c) => c.status?.toLowerCase() === "active"
            );

            const defaultCycle = active || data[data.length - 1];

            if (defaultCycle) {
                setSelectedCycleId(defaultCycle.id.toString());
            }

        } catch (err) {
            console.error("Error fetching cycles:", err);
        }
    };

    useEffect(() => {
        if (selectedCycleId) {
            fetchReportData();
        }
    }, [selectedCycleId, location.pathname]);

    const fetchReportData = async () => {
        if (!selectedCycleId) return;

        try {
            setLoading(true);

            const managerName =
                localStorage.getItem("userName");

            const res = await getReports(
                managerName,
                selectedCycleId
            );

            setReportData(res.data || []);

        } catch (err) {
            console.error("Error loading reports:", err);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔍 FILTER
    const filteredData = reportData.filter((emp) => {

        const matchSearch = (emp.name || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            statusFilter === "ALL" ||
            emp.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // 📊 STATS
    const totalEmployees = filteredData.length;

    const completedCount = filteredData.filter(
        (e) => e.status === "COMPLETED"
    ).length;

    const pendingCount = filteredData.filter(
        (e) =>
            e.status === "PENDING" ||
            e.status === "SUBMITTED"
    ).length;

    // 📥 EXPORT EXCEL
    const exportToExcel = () => {

        const data = filteredData.map((emp) => ({
            Name: emp.name,
            Designation: emp.designation,
            Status: emp.status,
            Rating: emp.rating,
            Feedback: emp.remarks,
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(data);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Manager Reports"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(
            blob,
            `Manager_Report_${selectedCycleId}.xlsx`
        );
    };

    const getStatusStyle = (status) => {

        if (status === "COMPLETED") {
            return "bg-green-100 text-green-700";
        }

        if (status === "SUBMITTED") {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <div className="min-h-screen bg-white-50 p-2 space-y-4">

            {/* 🔥 HEADER */}
            <div className="bg-blue-50 rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between gap-2">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manager Reports
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Analyze employee appraisal reports,
                        ratings and review status.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">

                    {/* Cycle Dropdown */}
                    <select
                        value={selectedCycleId}
                        onChange={(e) =>
                            setSelectedCycleId(e.target.value)
                        }
                        className="border border-gray-200 bg-gray-50 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        {cycles.map((c) => (
                            <option
                                key={c.id}
                                value={c.id}
                            >
                                {c.name ||
                                    `${c.startDate} - ${c.endDate}`}
                            </option>
                        ))}
                    </select>

                    {/* Export */}
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-sm transition"
                    >
                        <FaFileExcel />
                        Export
                    </button>
                </div>
            </div>

            {/* 📊 STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* Total */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Employees
                            </p>

                            <h2 className="text-3xl font-bold text-gray-800 mt-1">
                                {totalEmployees}
                            </h2>
                        </div>

                        <div className="bg-blue-100 p-4 rounded-2xl">
                            <FaUsers className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Completed
                            </p>

                            <h2 className="text-3xl font-bold text-green-600 mt-1">
                                {completedCount}
                            </h2>
                        </div>

                        <div className="bg-green-100 p-4 rounded-2xl">
                            <FaCheckCircle className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Pending Reviews
                            </p>

                            <h2 className="text-3xl font-bold text-amber-500 mt-1">
                                {pendingCount}
                            </h2>
                        </div>

                        <div className="bg-yellow-100 p-4 rounded-2xl">
                            <FaChartBar className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔍 FILTER SECTION */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">

                <div className="flex flex-wrap gap-4 items-center justify-between">

                    <div className="flex flex-wrap gap-4 items-center">

                        {/* Search */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl w-72">
                            <FaSearch className="text-gray-400 mr-3" />

                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="bg-transparent outline-none w-full text-sm"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="border border-gray-200 bg-gray-50 px-4 py-3 rounded-2xl outline-none text-sm"
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="SUBMITTED">
                                Submitted
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>
                        </select>
                    </div>

                    {/* Clear */}
                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                        }}
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* ⭐ RATING DISTRIBUTION */}
            {/* <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

                <div className="flex justify-between items-center mb-5">

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Rating Distribution
                        </h3>

                        <p className="text-sm text-gray-500">
                            Overview of employee ratings
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                    {ratingCount.map((r) => (
                        <div
                            key={r.rating}
                            className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 rounded-2xl p-5 text-center hover:shadow-md transition"
                        >
                            <div className="flex justify-center mb-2">
                                <FaStar className="text-yellow-400 text-xl" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800">
                                {r.rating} Star
                            </h3>

                            <p className="text-2xl font-bold text-yellow-600 mt-2">
                                {r.count}
                            </p>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* 📋 REPORT TABLE */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Table Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b">

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Team Appraisal Reports
                        </h3>

                        <p className="text-sm text-gray-500">
                            Employee performance and appraisal feedback
                        </p>
                    </div>

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                        {filteredData.length} Records
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading reports...
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">
                            No reports found
                        </div>
                    ) : (
                        <table className="w-full text-sm">

                            <thead className="bg-blue-100 text-gray-600">
                                <tr>
                                    <th className="p-4 text-left">
                                        Employee
                                    </th>

                                    <th className="p-4 text-left">
                                        Designation
                                    </th>

                                    <th className="p-4 text-center">
                                        Status
                                    </th>

                                    <th className="p-4 text-center">
                                        Rating
                                    </th>

                                    <th className="p-4 text-left">
                                        Feedback
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredData.map((emp) => (

                                    <tr
                                        key={emp.id}
                                        className="border-t hover:bg-blue-50/40 transition"
                                    >

                                        {/* Employee */}
                                        <td className="p-4">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {emp.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Employee ID: {emp.id}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Designation */}
                                        <td className="p-4 text-gray-700">
                                            {emp.designation}
                                        </td>

                                        {/* Status */}
                                        <td className="p-4 text-center">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                                                    emp.status
                                                )}`}
                                            >
                                                {emp.status}
                                            </span>
                                        </td>

                                        {/* Rating */}
                                        <td className="p-4">

                                            <div className="flex justify-center gap-1">

                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FaStar
                                                        key={s}
                                                        className={
                                                            s <= emp.rating
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </td>

                                        {/* Remarks */}
                                        <td className="p-4 text-gray-600 max-w-sm">
                                            <p className="line-clamp-2">
                                                {emp.remarks ||
                                                    "No feedback available"}
                                            </p>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerReports;
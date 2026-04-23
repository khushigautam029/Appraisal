import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { FaFileExcel, FaSearch, FaStar } from "react-icons/fa";
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

            const active = data.find(c => c.status === "Active");
            const defaultCycle = active || data[data.length - 1];
            if (defaultCycle) {
                setSelectedCycleId(defaultCycle.id.toString());
            }
        } catch (err) {
            console.error("Error fetching cycles:", err);
        }
    };

    useEffect(() => {
        if (selectedCycleId) fetchReportData();
    }, [selectedCycleId, location.pathname]);

    const fetchReportData = async () => {
        if (!selectedCycleId) return;

        try {
            setLoading(true);
            const managerName = localStorage.getItem("userName");
            const res = await getReports(managerName, selectedCycleId);
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
            statusFilter === "ALL" || emp.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // ⭐ RATING DISTRIBUTION
    const ratingCount = [1, 2, 3, 4, 5].map((r) => ({
        rating: r,
        count: filteredData.filter((e) => e.rating === r).length,
    }));

    // 🔴 NEEDS IMPROVEMENT

    // 📥 EXPORT TO EXCEL
    const exportToExcel = () => {
        const data = filteredData.map((emp) => ({
            Name: emp.name,
            Designation: emp.designation,
            Status: emp.status,
            Rating: emp.rating,
            Feedback: emp.remarks,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(blob, `Report_${selectedCycleId}.xlsx`);
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manager Reports</h2>

                <div className="flex gap-3">
                    <select
                        value={selectedCycleId}
                        onChange={(e) => setSelectedCycleId(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        {cycles.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name || `${c.startDate} - ${c.endDate}`}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        <FaFileExcel /> Export
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4">
                <div className="flex items-center border bg-white px-3 py-2 rounded w-64">
                    <FaSearch className="mr-2 text-gray-400" />
                    <input
                        placeholder="Search employee name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none w-full"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <button 
                    onClick={() => {
                        setSearch("");
                        setStatusFilter("ALL");
                    }}
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    Clear Filters
                </button>
            </div>

            {/* ⭐ RATING DISTRIBUTION */}
            <div className="bg-white p-5 rounded shadow">
                <h3 className="font-semibold mb-3">Rating Distribution</h3>

                <div className="grid grid-cols-5 gap-4 text-center">
                    {ratingCount.map((r) => (
                        <div key={r.rating} className="bg-gray-100 p-3 rounded">
                            <p className="text-yellow-500 font-bold">
                                ⭐ {r.rating}
                            </p>
                            <p className="text-lg font-semibold">{r.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            

            {/* TABLE */}
            <div className="bg-white p-4 rounded shadow border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Team Appraisal Status</h3>
                    <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border">
                        {filteredData.length} records found
                    </span>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b text-gray-600">
                            <tr>
                                <th className="p-2">Name</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((emp) => (
                                <tr key={emp.id} className="border-b">
                                    <td className="p-2">{emp.name}</td>
                                    <td>{emp.designation}</td>

                                    <td>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            emp.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            emp.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {emp.status}
                                        </span>
                                    </td>

                                    <td className="flex gap-1">
                                        {[1,2,3,4,5].map((s) => (
                                            <FaStar
                                                key={s}
                                                className={
                                                    s <= emp.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                    </td>

                                    <td>{emp.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default ManagerReports;
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"; // ✅ FIXED IMPORT
import { getHrReviews, updateHrReview } from "../../services/hrService";

const ManagerAppraisalReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editStates, setEditStates] = useState({});

    // 🔍 Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getHrReviews();
            setReviews(data || []);
        } catch (e) {
            console.error("Error fetching HR reviews:", e);
        } finally {
            setLoading(false);
        }
    };

    // ✏️ Edit handler
    const handleEditChange = (id, field, value) => {
        setEditStates(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    // ✅ Submit
    const handleSubmit = async (id) => {
        const payload = editStates[id];
        const original = reviews.find(r => r.id === id);

        const rating = payload?.hrRating || original?.hrRating;
        const remarks = payload?.hrRemarks || original?.hrRemarks;

        if (!rating || !remarks) {
            alert("Please fill rating and remarks");
            return;
        }

        try {
            await updateHrReview(id, rating, remarks);
            alert("Review updated successfully!");
            fetchReviews();

            setEditStates(prev => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });

        } catch (e) {
            console.error(e);
            alert("Update failed");
        }
    };

    // ⭐ Promotion logic
    const handlePromotion = (empName) => {
        alert(`${empName} marked for promotion review`);
    };

    // 📊 Analytics
    const totalReviews = reviews.length;
    const completedCount = reviews.filter(r => r.hrRating).length;
    const pendingCount = reviews.filter(r => !r.hrRating).length;

    // 🔥 FILTER LOGIC (IMPORTANT)
    const filteredData = reviews.filter((r) => {
        const name = r.employee?.name?.toLowerCase() || "";

        const matchesSearch = name.includes(search.toLowerCase());

        const status = r.hrRating ? "COMPLETED" : "PENDING";

        const matchesStatus =
            statusFilter === "ALL" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // 📤 Export CSV
    const exportCSV = () => {
        const headers = ["Employee", "Manager Rating", "HR Rating", "Remarks"];
        const rows = reviews.map(r => [
            r.employee?.name,
            r.rating,
            r.hrRating || "",
            r.hrRemarks || ""
        ]);

        let csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "hr_reviews.csv";
        link.click();
    };

    return (
        <div className="p-1 space-y-4">

            {/* 🔷 Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        HR Appraisal Reviews
                    </h2>
    
                </div>

                <button
                    onClick={exportCSV}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                    Export CSV
                </button>
            </div>

            {/* 🔍 FILTER BAR */}
            <div className="flex flex-wrap gap-4 items-center">

                <div className="flex items-center border bg-white px-3 py-2 rounded w-64 shadow-sm">
                    <FaSearch className="mr-2 text-gray-400" />
                    <input
                        placeholder="Search employee name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none w-full text-sm"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-2 rounded shadow-sm text-sm"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
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

            {/* 📊 Analytics */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-500">Total Reviews</p>
                    <h3 className="text-xl font-bold">{totalReviews}</h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-500">Completed Reviews</p>
                    <h3 className="text-xl font-bold text-green-600">
                        {completedCount}
                    </h3>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-500">Pending Reviews</p>
                    <h3 className="text-xl font-bold text-amber-600">
                        {pendingCount}
                    </h3>
                </div>
            </div>

            {/* 🔷 Table */}
            <div className="bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-3 text-left">Employee</th>
                            <th className="p-3 text-center">Mgr Rating</th>
                            <th className="p-3">Mgr Remarks</th>
                            <th className="p-3">HR Rating</th>
                            <th className="p-3">HR Remarks</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-6 text-gray-400">
                                    No matching results
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((r) => {
                                const edit = editStates[r.id] || {
                                    hrRating: r.hrRating || "",
                                    hrRemarks: r.hrRemarks || ""
                                };

                                return (
                                    <tr key={r.id} className="border-t hover:bg-gray-50">

                                        <td className="p-3 font-medium">
                                            {r.employee?.name}
                                        </td>

                                        <td className="p-3 text-center">
                                            {r.rating}/5
                                        </td>

                                        <td className="p-3 text-gray-600">
                                            {r.remarks}
                                        </td>

                                        <td className="p-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={edit.hrRating}
                                                onChange={(e) =>
                                                    handleEditChange(r.id, "hrRating", e.target.value)
                                                }
                                                className="w-16 border rounded p-1 text-center"
                                            />
                                        </td>

                                        <td className="p-3">
                                            <input
                                                value={edit.hrRemarks}
                                                onChange={(e) =>
                                                    handleEditChange(r.id, "hrRemarks", e.target.value)
                                                }
                                                className="w-full border rounded p-1"
                                            />
                                        </td>

                                        <td className="p-3 text-center space-y-2">
                                            <button
                                                onClick={() => handleSubmit(r.id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() => handlePromotion(r.employee?.name)}
                                                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 w-full"
                                            >
                                                Promote
                                            </button>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerAppraisalReview;
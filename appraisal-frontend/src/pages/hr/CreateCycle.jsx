import { useEffect, useState } from "react";
import {
  FaCalendarPlus,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
} from "react-icons/fa";
import {
  createCycle,
  deleteCycle,
  getAllCycles,
  updateCycle,
} from "../../services/cycleService";

const CreateCycle = () => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch cycles
  const fetchCycles = async () => {
    try {
      setLoading(true);
      const res = await getAllCycles();
      setCycles(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  // 🔥 FY Generator
  const getFinancialYear = () => {
    if (!form.startDate) return "";

    const d = new Date(form.startDate);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    return month >= 4
      ? `FY ${year}-${(year + 1).toString().slice(-2)}`
      : `FY ${year - 1}-${year.toString().slice(-2)}`;
  };

  // 🔥 LIMIT: Max 2 cycles per FY
  const validateCycleLimit = () => {
    const fy = getFinancialYear();
    const count = cycles.filter((c) => c.name === fy).length;

    if (count >= 2) {
      alert("❌ Only 2 cycles allowed per Financial Year");
      return false;
    }
    return true;
  };

  // ✅ CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      alert("Please select dates");
      return;
    }

    if (new Date(form.startDate) >= new Date(form.endDate)) {
      alert("Start date must be before End date");
      return;
    }

    if (!validateCycleLimit()) return;

    const fyName = getFinancialYear();

    try {
      await createCycle({
        name: fyName,
        startDate: form.startDate,
        endDate: form.endDate,
        status: "Active",
      });

      alert(`✅ Created: ${fyName}`);
      setForm({ startDate: "", endDate: "" });

      fetchCycles();
    } catch (err) {
      console.error(err);
      alert("Error creating cycle");
    }
  };

  // ✅ TOGGLE STATUS
  const toggleStatus = async (cycle) => {
    try {
      if (cycle.status !== "Active") {
        const active = cycles.find((c) => c.status === "Active");
        if (active) {
          await updateCycle(active.id, {
            ...active,
            status: "Inactive",
          });
        }
      }

      await updateCycle(cycle.id, {
        ...cycle,
        status: cycle.status === "Active" ? "Inactive" : "Active",
      });

      fetchCycles();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const deleteCycleItem = async (id) => {
    if (!window.confirm("Delete this cycle?")) return;

    try {
      await deleteCycle(id);
      fetchCycles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-1 bg-gray-100 min-h-screen space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Appraisal Cycles
        </h1>
      </div>

      {/* CREATE CARD */}
      <div className="bg-white p-6 rounded-2xl shadow flex flex-wrap gap-4 items-end">

        {/* FY */}
        <div>
          <label className="text-sm text-gray-600">Financial Year</label>
          <input
            value={getFinancialYear()}
            disabled
            className="border p-2 rounded bg-gray-100 w-40"
          />
        </div>

        {/* START */}
        <div>
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        {/* END */}
        <div>
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow flex items-center gap-2"
        >
          <FaCalendarPlus />
          Create Cycle
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="p-4 border-b flex justify-between">
          <h2 className="font-semibold text-gray-800">
            All Cycles
          </h2>
          <span className="text-sm text-gray-500">
            Total: {cycles.length}
          </span>
        </div>

        {loading ? (
          <p className="p-6 text-center">Loading...</p>
        ) : cycles.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No cycles found
          </p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Cycle</th>
                <th className="p-3 text-center">Start</th>
                <th className="p-3 text-center">End</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cycles.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">{c.name}</td>

                  <td className="text-center">{c.startDate}</td>

                  <td
                    className={`text-center ${
                      new Date() > new Date(c.endDate)
                        ? "text-red-500 font-semibold"
                        : ""
                    }`}
                  >
                    {c.endDate}
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="flex justify-center gap-4 p-3">

                    {/* TOGGLE */}
                    <button
                      onClick={() => toggleStatus(c)}
                      className="text-indigo-600 hover:scale-110 transition"
                    >
                      {c.status === "Active" ? (
                        <FaToggleOn size={20} />
                      ) : (
                        <FaToggleOff size={20} />
                      )}
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => deleteCycleItem(c.id)}
                      disabled={c.status === "Active"}
                      className={`p-2 rounded ${
                        c.status === "Active"
                          ? "text-gray-400"
                          : "text-red-500 hover:bg-red-100"
                      }`}
                    >
                      <FaTrash />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default CreateCycle;
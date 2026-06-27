import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarPlus,
  FaCheckCircle,
  FaClock,
  FaTrash,
} from "react-icons/fa";

import {
  createCycle,
  deleteCycle,
  getAllCycles,
} from "../../services/cycleService";

const CreateCycle = () => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH CYCLES
  const fetchCycles = async () => {
    try {
      setLoading(true);

      const res = await getAllCycles();

      // 🔥 AUTO HANDLE EXPIRED CYCLE IN FRONTEND
      const updatedCycles = (res.data || []).map((cycle) => {
        const expired =
          new Date() > new Date(cycle.endDate);

        return {
          ...cycle,
          status: expired ? "Ended" : cycle.status,
        };
      });

      setCycles(updatedCycles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  // 🔥 FINANCIAL YEAR
  const getFinancialYear = () => {
    if (!form.startDate) return "";

    const d = new Date(form.startDate);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    return month >= 4
      ? `FY ${year}-${(year + 1)
        .toString()
        .slice(-2)}`
      : `FY ${year - 1}-${year
        .toString()
        .slice(-2)}`;
  };

  // 🔥 ONLY 1 CYCLE PER FY
  const validateCycleLimit = () => {
    const fy = getFinancialYear();

    const exists = cycles.find(
      (c) => c.name === fy
    );

    if (exists) {
      alert(
        "Only one cycle is allowed per Financial Year"
      );
      return false;
    }

    return true;
  };

  // 🔥 ERROR HELPER
  const getErrorMessage = (
    err,
    fallback
  ) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    fallback;

  // ✅ CREATE CYCLE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      alert("Please select dates");
      return;
    }

    if (
      new Date(form.startDate) >=
      new Date(form.endDate)
    ) {
      alert(
        "Start date must be before End date"
      );
      return;
    }

    if (!validateCycleLimit()) return;

    const fyName = getFinancialYear();

    try {
      // 🔥 ONLY ONE ACTIVE CYCLE
      await createCycle({
        name: fyName,
        startDate: form.startDate,
        endDate: form.endDate,
        status: "Active",
      });

      alert(`✅ Created: ${fyName}`);

      setForm({
        startDate: "",
        endDate: "",
      });

      fetchCycles();
    } catch (err) {
      console.error(err);

      alert(
        getErrorMessage(
          err,
          "Error creating cycle"
        )
      );
    }
  };

  // ✅ DELETE
  // ✅ DELETE
  const deleteCycleItem = async (cycle) => {

    const expired =
      new Date() > new Date(cycle.endDate);

    // ❌ ENDED CYCLE CANNOT DELETE
    if (expired || cycle.status === "Ended") {
      alert("Ended cycle cannot be deleted");
      return;
    }

    if (!window.confirm("Delete this cycle?"))
      return;

    try {
      await deleteCycle(cycle.id);

      fetchCycles();
    } catch (err) {
      console.error(err);

      alert(
        getErrorMessage(
          err,
          "Error deleting cycle"
        )
      );
    }
  };

  // 📊 STATS
  const activeCount = cycles.filter(
    (c) => c.status === "Active"
  ).length;

  const endedCount = cycles.filter(
    (c) => c.status === "Ended"
  ).length;

  const inactiveCount = cycles.filter(
    (c) => c.status === "Inactive"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6 space-y-6">

      {/* 🔷 HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Appraisal Cycles
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Manage yearly appraisal cycles
          </p>
        </div>

        {/* STATS */}
        <div className="flex gap-4 flex-wrap">

          <div className="bg-blue-100 px-5 py-4 rounded-2xl shadow-sm border border-gray-100 min-w-[130px]">
            <p className="text-xs text-gray-500">
              Total Cycles
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {cycles.length}
            </h3>
          </div>

          <div className="bg-green-50 px-5 py-4 rounded-2xl shadow-sm border border-green-100 min-w-[130px]">
            <p className="text-xs text-green-600">
              Active
            </p>

            <h3 className="text-2xl font-bold text-green-700 mt-1">
              {activeCount}
            </h3>
          </div>

          <div className="bg-gray-100 px-5 py-4 rounded-2xl shadow-sm border min-w-[130px]">
            <p className="text-xs text-gray-600">
              Inactive
            </p>

            <h3 className="text-2xl font-bold text-gray-700 mt-1">
              {inactiveCount}
            </h3>
          </div>

          <div className="bg-red-50 px-5 py-4 rounded-2xl shadow-sm border border-red-100 min-w-[130px]">
            <p className="text-xs text-red-600">
              Ended
            </p>

            <h3 className="text-2xl font-bold text-red-700 mt-1">
              {endedCount}
            </h3>
          </div>

        </div>
      </div>

      {/* 🔷 CREATE CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-indigo-100 p-3 rounded-2xl">
            <FaCalendarPlus className="text-indigo-600 text-lg" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Cycle
            </h2>

            <p className="text-sm text-gray-500">
              One appraisal cycle per financial year
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">

          {/* FY */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Financial Year
            </label>

            <input
              value={getFinancialYear()}
              disabled
              placeholder="Auto Generated"
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-2xl"
            />
          </div>

          {/* START */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Start Date
            </label>

            <div className="relative">

              <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 p-3 pl-10 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>

          {/* END */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              End Date
            </label>

            <div className="relative">

              <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate:
                      e.target.value,
                  })
                }
                className="w-full border border-gray-200 p-3 pl-10 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-end">

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-medium shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <FaCalendarPlus />
              Create Cycle
            </button>

          </div>

        </div>
      </div>

      {/* 🔷 TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-gray-50 flex justify-between items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              All Cycles
            </h2>

            <p className="text-sm text-gray-500">
              View appraisal cycle status
            </p>
          </div>

          <span className="bg-indigo-100 text-indigo-700 text-sm px-4 py-1 rounded-full font-medium">
            {cycles.length} Cycles
          </span>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : cycles.length === 0 ? (
          <div className="p-10 text-center">

            <FaClock className="mx-auto text-4xl text-gray-300 mb-3" />

            <p className="text-gray-500">
              No cycles available
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 text-left">
                    Cycle
                  </th>

                  <th className="p-4 text-center">
                    Start Date
                  </th>

                  <th className="p-4 text-center">
                    End Date
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {cycles.map((c) => {
                  const expired =
                    new Date() >
                    new Date(c.endDate);

                  return (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-gray-50 transition"
                    >

                      {/* CYCLE */}
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="bg-indigo-100 p-2 rounded-xl">
                            <FaCalendarAlt className="text-indigo-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {c.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              Annual Appraisal Cycle
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* START */}
                      <td className="text-center text-gray-700">
                        {c.startDate}
                      </td>

                      {/* END */}
                      <td
                        className={`text-center font-medium ${expired
                          ? "text-red-500"
                          : "text-gray-700"
                          }`}
                      >
                        {c.endDate}
                      </td>

                      {/* STATUS */}
                      <td className="text-center">

                        {expired ? (
                          <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-semibold">
                            Ended
                          </span>
                        ) : c.status ===
                          "Active" ? (
                          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1 w-fit mx-auto">
                            <FaCheckCircle className="text-[10px]" />
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-xs font-semibold">
                            Inactive
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">

                        <div className="flex justify-center">

                          <button
                            onClick={() => deleteCycleItem(c)}
                            disabled={expired}
                            className={`p-3 rounded-xl transition ${expired
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-red-50 text-red-500 hover:bg-red-100"
                              }`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCycle;
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getEmployees } from "../../services/hrService";

// const Users = () => {
//     const navigate = useNavigate();
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         loadUsers();
//     }, []);

//     const loadUsers = async () => {
//         try {
//             const data = await getEmployees();
//             setUsers(data || []);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">

//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-6">
//                 <div>
//                     <h1 className="text-2xl font-bold">Employee Management</h1>
//                     <p className="text-gray-500">Manage employees, roles & structure</p>
//                 </div>

//                 <button
//                     onClick={() => navigate("/hr/add-user")}
//                     className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700"
//                 >
//                     + Add Employee
//                 </button>
//             </div>

//             {/* TABLE */}
//             <div className="bg-white rounded-xl shadow overflow-hidden">

//                 <table className="w-full">
//                     <thead className="bg-gray-50 text-gray-600">
//                         <tr>
//                             <th className="p-4">Name</th>
//                             <th>Email</th>
//                             <th>Designation</th>
//                             <th>Department</th>
//                             <th>Manager</th>
//                             <th className="text-center">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {users.length === 0 ? (
//                             <tr>
//                                 <td colSpan="6" className="text-center p-6 text-gray-500">
//                                     No employees found
//                                 </td>
//                             </tr>
//                         ) : (
//                             users.map((u) => (
//                                 <tr key={u.id} className="border-t hover:bg-gray-50">
//                                     <td className="p-4 font-medium">{u.name}</td>
//                                     <td>{u.email}</td>
//                                     <td>{u.designation || "-"}</td>
//                                     <td>{u.department || "-"}</td>
//                                     <td>{u.manager || "-"}</td>

//                                     <td className="text-center">
//                                         <button
//                                             onClick={() => navigate(`/hr/edit-user/${u.id}`)}
//                                             className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                                         >
//                                             Edit
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>

//             </div>
//         </div>
//     );
// };

// export default Users;
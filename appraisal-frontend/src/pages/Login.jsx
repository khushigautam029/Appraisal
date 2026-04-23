import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      // ✅ Store data
      localStorage.setItem("login", "true");
      localStorage.setItem("token", data.token); // Add token storage
      localStorage.setItem("role", data.role);
      localStorage.setItem("actualRole", data.role);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.name); // ✅ STORE NAME
      localStorage.setItem("userEmail", data.email); // ✅ STORE EMAIL

      setIsLoggedIn(true);

      setIsLoggedIn(true);

      const upperRole = data.role ? data.role.toUpperCase() : "";

      // ✅ Redirect based on role (Prioritize HR > MANAGER > EMPLOYEE)
      if (upperRole.includes("HR")) {
        navigate("/hr-dashboard");
      } else if (upperRole.includes("MANAGER")) {
        navigate("/manager-dashboard");
      } else if (upperRole.includes("EMPLOYEE")) {
        navigate("/sample-appraisal");
      } else {
        navigate("/login");
      }

    } catch {
      alert("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">

      {/* 🔥 Background Gradient Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

      {/* 🔥 Card */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 object-cover rounded-full mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Appraisal System
          </h2>
          <p className="text-gray-500 text-sm">
            Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 p-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
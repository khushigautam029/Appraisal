import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://3.109.25.2:8080";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({}));

        throw new Error(
          errorData.message ||
            "Invalid credentials ❌"
        );
      }

      const data = await res.json();

      // ✅ Store data
      localStorage.setItem("login", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("actualRole", data.role);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      setIsLoggedIn(true);

      const upperRole = data.role
        ? data.role.toUpperCase()
        : "";

      // ✅ Redirect based on role
      if (upperRole.includes("HR")) {
        navigate("/hr-dashboard");
      } else if (
        upperRole.includes("MANAGER")
      ) {
        navigate("/manager-dashboard");
      } else if (
        upperRole.includes("EMPLOYEE")
      ) {
        navigate("/sample-appraisal");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert(err.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 relative overflow-hidden px-4">

      {/* 🔥 Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl"></div>

      {/* 🔥 Floating Glass Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Shadow Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-[35px] blur-2xl scale-105"></div>

        {/* Card */}
        <div className="relative backdrop-blur-xl bg-white/80 border border-white/40 rounded-[35px] shadow-2xl px-8 py-10 overflow-hidden">

          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>

          {/* Logo */}
          <div className="flex flex-col items-center relative z-10">

            <div className="relative group">

              <div className="absolute inset-0 bg-blue-300 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition"></div>

              <img
                src={logo}
                alt="logo"
                className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            </div>

            <h2 className="mt-5 text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Appraisal System
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Welcome back 👋
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5 relative z-10"
          >

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <MdEmail className="absolute left-4 top-4 text-gray-400 text-lg" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/70 shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-4 text-gray-400 text-sm" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 bg-white/70 shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                />

                <span
                  className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-blue-600 transition"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 pt-2">
              Secure Employee Performance Portal
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
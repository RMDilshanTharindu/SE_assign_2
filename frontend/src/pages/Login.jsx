import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/resources");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-violet-600 to-pink-500 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-5xl font-bold mb-5">
            Campus Resource
            Management System
          </h1>

          <p className="text-xl text-purple-100">
            Manage campus resources efficiently
            with a modern dashboard.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">
          <h2 className="text-3xl font-bold mb-2">
            Welcome Back
          </h2>

          <p className="text-slate-500 mb-6">
            Sign in to continue
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-xl"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition"
            >
              Login
            </button>

            <div className="text-center">
              <span className="text-slate-500">
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  ml-2
                  text-purple-600
                  font-semibold
                  hover:text-purple-800
                  transition
                "
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
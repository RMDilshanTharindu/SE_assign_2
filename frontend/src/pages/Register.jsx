import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registration Successful!");

      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-violet-600 to-pink-500 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-5xl font-bold mb-5">
            Join Campus Resource
            Management System
          </h1>

          <p className="text-xl text-purple-100">
            Create your account and start managing
            campus resources efficiently.
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div className="w-full lg:w-1/2 flex justify-center items-center bg-slate-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-[420px]">
          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-slate-500 mb-6">
            Register to continue
          </p>

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded-xl"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-xl"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-xl"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <select
              className="w-full border p-3 rounded-xl"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="student">
                Student
              </option>

              <option value="staff">
                Staff
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            <button
              type="submit"
              className="
                w-full
                bg-purple-600
                text-white
                p-3
                rounded-xl
                hover:bg-purple-700
                transition
              "
            >
              Create Account
            </button>

            <div className="text-center">
              <span className="text-slate-500">
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="
                  ml-2
                  text-purple-600
                  font-semibold
                  hover:text-purple-800
                "
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import {
  FaBook,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import { Outlet, Link, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg flex flex-col">
        <div className="p-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
            A
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Campus Resource
          </h2>

          <p className="text-gray-500 text-sm">
            Management System
          </p>
        </div>

        <nav className="flex-1 px-4">
          <Link
            to="/resources"
            className="
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              bg-purple-100
              text-purple-700
              font-medium
              hover:bg-purple-200
              transition
            "
          >
            <FaBook />
            Resources
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <FaUserCircle
              size={40}
              className="text-purple-600"
            />

            <div>
              <p className="font-semibold">
                Administrator
              </p>

              <p className="text-sm text-gray-500">
                System Admin
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="
              w-full
              bg-red-500
              text-white
              p-3
              rounded-xl
              hover:bg-red-600
              transition
            "
          >
            <div className="flex items-center justify-center gap-2">
              <FaSignOutAlt />
              Logout
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white shadow-sm px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500">
              Welcome back 👋
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="
                  w-80
                  bg-gray-100
                  rounded-xl
                  py-3
                  pl-5
                  pr-4
                  border
                  border-gray-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />
            </div>

            <FaBell
              size={22}
              className="text-gray-500 cursor-pointer hover:text-purple-600 transition"
            />

            <FaUserCircle
              size={40}
              className="text-purple-600 cursor-pointer"
            />
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
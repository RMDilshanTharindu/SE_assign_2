import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  FaBook,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Resources() {

  const [resources, setResources] = useState([]);

  useEffect(() => {

    const load = async () => {
      const res = await api.get("/resources");
      setResources(res.data);
    };

    load();

  }, []);

  const available =
    resources.filter(
      r => r.status === "available"
    ).length;

  return (
    <div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white p-6 rounded-3xl">

          <p>Total Resources</p>

          <h2 className="text-4xl font-bold mt-3">
            {resources.length}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Available
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            {available}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <p className="text-gray-500">
            Reserved
          </p>

          <h2 className="text-4xl font-bold text-red-500">
            {resources.length - available}
          </h2>

        </div>

      </div>

      {/* Resource Grid */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {resources.map(resource => (

          <div
            key={resource._id}
            className="
            bg-white
            rounded-3xl
            p-6
            shadow
            hover:shadow-xl
            hover:-translate-y-1
            transition
            "
          >

            <div className="flex justify-between">

              <div className="bg-purple-100 p-4 rounded-2xl">

                <FaBook
                  className="text-purple-600"
                />

              </div>

              <span
                className={`
                px-3
                py-1
                rounded-full
                text-sm
                ${
                  resource.status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }
                `}
              >
                {resource.status}
              </span>

            </div>

            <h2 className="mt-5 text-xl font-bold">
              {resource.name}
            </h2>

            <p className="flex items-center gap-2 mt-3 text-gray-500">

              <FaMapMarkerAlt />

              {resource.location}

            </p>

            <button
              className="
              mt-6
              w-full
              bg-gradient-to-r
              from-purple-600
              to-violet-500
              text-white
              p-3
              rounded-xl
              "
            >
              View Details
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
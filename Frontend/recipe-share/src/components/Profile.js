import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/userprofile/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  }, [navigate, API]);

  if (!user) return null;

  const firstLetter = user.name?.charAt(0)?.toUpperCase();

  return (
    <>
      <NavBar />

      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/assets/doodle.jpg')" }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-white/60"></div>

        {/* CARD */}
        <div
          className="mt-[-100px] w-full max-w-2xl bg-white/85 backdrop-blur-xl
                     rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.15)]
                     p-10 animate-fadeIn relative z-10"
        >
          {/* AVATAR */}
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center
                         text-4xl font-bold
                         bg-gradient-to-tr from-amber-400 to-orange-500
                         text-white shadow-xl ring-4 ring-white"
            >
              {firstLetter || "?"}
            </div>
          </div>

          {/* NAME */}
          <h2 className="text-center text-3xl font-bold mt-4 text-[#1f2933]">
            Hey {user.name} 👋
          </h2>

          {/* EMAIL */}
          <p className="text-center text-sm text-gray-500 mt-1">
            {user.email}
          </p>

          {/* LAST LOGIN */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-semibold mt-1">
              {user.last_login
                ? new Date(user.last_login).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "First login 🎉"}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/my-recipes")}
              className="w-full py-3 text-white font-semibold rounded-full
                         bg-gradient-to-r from-blue-500 to-indigo-500
                         hover:scale-105 transition shadow-lg"
            >
              View My Recipes
            </button>

            <button
              onClick={() => navigate("/change-password")}
              className="w-full py-3 rounded-full font-semibold
                         border border-gray-300 hover:bg-gray-100 transition"
            >
              Change Password
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  const API = process.env.REACT_APP_API_URL;

  // FETCH USER PROFILE (AVATAR)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios
      .get(`${API}/userprofile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("authToken"));
  }, [API]);

  // CLOSE DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LOGOUT
  const logout = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post(
        `${API}/userlogout/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      })
      .catch(() => {
        // backend fails — force logout anyway
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center rounded-md relative z-50">
      {/* LOGO */}
      <h1
        onClick={() => navigate("/home")}
        className="text-xl font-bold cursor-pointer"
      >
        RecipeVerse
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* CREATE BUTTON */}
        <button
          onClick={() => navigate("/create-recipe")}
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
        >
          Create Recipe
        </button>

        {/* AVATAR + DROPDOWN */}
        <div className="relative" ref={menuRef}>
          {/* AVATAR */}
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full
                       flex items-center justify-center
                       font-bold text-white cursor-pointer
                       bg-gradient-to-tr from-amber-400 to-orange-500
                       shadow ring-2 ring-white"
            title={user?.name}
          >
            {firstLetter || "?"}
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-lg w-40 z-50 overflow-hidden">
              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </p>

              <p
                className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

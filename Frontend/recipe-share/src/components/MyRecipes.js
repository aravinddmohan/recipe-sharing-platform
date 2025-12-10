import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL;

  // AUTH GUARD + FETCH
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/myrecipe/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setRecipes(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("MYRECIPES ERROR:", err.response || err);

        if (err.response && err.response.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          setError("Couldn't load your recipes. Try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate, API]);

  // DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete this recipe? This can't be undone.")) return;

    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    axios
      .delete(`${API}/userdeleterecipe/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      })
      .catch(() => alert("Failed to delete recipe 💀"));
  };

  const handleEdit = (id) => navigate(`/edit-recipe/${id}`);

  return (
    <>
      <NavBar />

      {/* BACKGROUND */}
      <div
        className="min-h-screen relative"
        style={{
          backgroundImage: "url('/assets/doodle.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* BLUR OVERLAY */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/60"></div>

        <button
          onClick={() => navigate("/home")}
          className="relative z-10 mb-6 ml-6 px-5 py-2 bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition"
        >
          ← Back to Home
        </button>

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10 -mt-4">

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 rounded-full
                           bg-yellow-400 text-gray-900
                           shadow-md hover:bg-yellow-300
                           active:scale-95 transition
                           text-sm font-medium"
              >
                ← Back
              </button>

              <h2 className="text-2xl font-bold flex items-center gap-2">
                🍽 My Recipes
              </h2>
            </div>

            <button
              onClick={() => navigate("/create-recipe")}
              className="px-4 py-2 rounded-lg
                         bg-gradient-to-tr from-amber-400 to-orange-500
                         text-white shadow hover:scale-105 transition"
            >
              + Add New
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <p className="bg-red-100 text-red-700 p-4 rounded-lg text-center mb-4">
              {error}
            </p>
          )}

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-600">Loading recipes...</p>
          )}

          {/* EMPTY */}
          {!loading && recipes.length === 0 && !error && (
            <div className="text-center mt-20">
              <p className="text-xl text-gray-600 mb-3">
                no recipes added
              </p>
              <button
                onClick={() => navigate("/create-recipe")}
                className="mt-3 px-5 py-2 bg-amber-400 text-white rounded-lg shadow"
              >
                Create First Dish
              </button>
            </div>
          )}

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">

            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="group bg-white/95
                           rounded-2xl overflow-hidden
                           shadow-lg hover:shadow-2xl
                           transform hover:-translate-y-1
                           transition-all cursor-pointer"
              >

                {/* IMAGE */}
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img
                    src={`${API}${recipe.image}`}
                    alt={recipe.recipe_name}
                    className="w-full h-full object-cover
                               group-hover:scale-110 transition-transform"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>

                {/* BODY */}
                <div className="p-4">

                  <h3 className="font-semibold text-lg truncate">
                    {recipe.recipe_name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-2 text-xs">

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {recipe.difficulty}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      ⏱ {recipe.cooking_time} min
                    </span>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      👁 {recipe.views}
                    </span>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between mt-4 gap-3">

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-blue-600 hover:bg-blue-700
                             text-white font-medium
                             shadow-sm transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(recipe.id);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-rose-600 hover:bg-rose-700
                             text-white font-medium
                             shadow-sm transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(recipe.id);
                      }}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipe_name: "",
    ingredients: "",
    steps: "",
    cooking_time: "",
    difficulty: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const API = process.env.REACT_APP_API_URL;

  // ✅ AUTH + FETCH
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/usersinglerecipe/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setForm({
          recipe_name: res.data.recipe_name,
          ingredients: res.data.ingredients,
          steps: res.data.steps,
          cooking_time: res.data.cooking_time,
          difficulty: res.data.difficulty,
        });
        setError("");
      })
      .catch(() => setError("Failed to load recipe 😭"))
      .finally(() => setLoading(false));
  }, [id, navigate, API]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) return navigate("/login");

    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (image) data.append("image", image);

    axios
      .post(`${API}/userupdaterecipe/${id}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setMsg("✅ Recipe updated successfully!");
        setTimeout(() => navigate("/my-recipes"), 1200);
      })
      .catch(() => {
        setError("Update failed 💀");
      });
  };

  return (
    <>
      <NavBar />

      {/* 🌄 BACKGROUND */}
      <div
        className="min-h-screen relative flex justify-center items-start pt-12"
        style={{
          backgroundImage: "url('/assets/doodle.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 🌀 BLUR */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/60"></div>

        {/* 🧱 FORM CARD */}
        <div
          className="relative z-10 w-full max-w-xl
                     bg-white/90 backdrop-blur-xl
                     shadow-[0_40px_80px_rgba(0,0,0,0.15)]
                     rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            ✏️ Edit Recipe
          </h2>

          {error && (
            <p className="mb-4 text-red-700 bg-red-100 p-3 rounded-lg">
              {error}
            </p>
          )}

          {msg && (
            <p className="mb-4 text-green-700 bg-green-100 p-3 rounded-lg">
              {msg}
            </p>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading recipe...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <input
                type="text"
                name="recipe_name"
                value={form.recipe_name}
                onChange={handleChange}
                placeholder="Recipe Name"
                className="w-full px-5 py-3 rounded-xl
                           border border-gray-300
                           focus:ring-2 focus:ring-amber-400
                           outline-none transition"
                required
              />

              {/* INGREDIENTS */}
              <textarea
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                rows="3"
                placeholder="Ingredients (comma separated)"
                className="w-full px-5 py-3 rounded-xl resize-none
                           border border-gray-300
                           focus:ring-2 focus:ring-amber-400
                           outline-none transition"
                required
              />

              {/* STEPS */}
              <textarea
                name="steps"
                value={form.steps}
                onChange={handleChange}
                rows="4"
                placeholder="Steps (use arrows → or new lines)"
                className="w-full px-5 py-3 rounded-xl resize-none
                           border border-gray-300
                           focus:ring-2 focus:ring-amber-400
                           outline-none transition"
                required
              />

              {/* TIME + DIFFICULTY */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="cooking_time"
                  value={form.cooking_time}
                  onChange={handleChange}
                  placeholder="Time (mins)"
                  className="px-4 py-3 rounded-xl border
                             focus:ring-2 focus:ring-amber-400"
                  required
                />

                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl border
                             focus:ring-2 focus:ring-amber-400"
                  required
                >
                  <option value="">Difficulty</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* IMAGE */}
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-gray-600"
              />

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-full
                           bg-gradient-to-r from-amber-400 to-orange-500
                           hover:from-orange-500 hover:to-amber-500
                           text-white font-semibold
                           shadow-lg hover:scale-[1.02]
                           transition-all active:scale-95"
              >
                Update Recipe
              </button>

            </form>
          )}

        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateRecipe() {

  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    steps: "",
    cooking_time: "",
    difficulty: "Easy",
    image: null,
  });

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  // ✅ Auth Guard
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.ingredients || !form.steps || !form.cooking_time) {
      alert("All fields are required 🔥");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const payload = new FormData();
    payload.append("recipe_name", form.name);
    payload.append("ingredients", form.ingredients);
    payload.append("steps", form.steps);
    payload.append("cooking_time", form.cooking_time);
    payload.append("difficulty", form.difficulty);
    if (form.image) payload.append("image", form.image);

    axios
      .post(`${API}/useraddrecipe/`, payload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Recipe published 🚀");
          navigate("/home");
        } else {
          alert("Something went wrong 😵");
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error 💀");
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/doodle.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      {/* Recipe Card */}
      <div
        className="relative z-10 w-full max-w-md
                   bg-white/85 backdrop-blur-xl
                   shadow-[0_40px_120px_rgba(0,0,0,0.25)]
                   rounded-3xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-[#1f2933] mb-2">
          Create Recipe 🍳
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Drop your masterpiece into the universe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Recipe Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-amber-400 outline-none"
          />

          <textarea
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={form.ingredients}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-amber-400 outline-none"
          />

          <textarea
            name="steps"
            placeholder="Steps (one per line)"
            value={form.steps}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-amber-400 outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="cooking_time"
              type="number"
              placeholder="Time (mins)"
              value={form.cooking_time}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300
                         focus:ring-2 focus:ring-amber-400 outline-none"
            />

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-gray-300
                         focus:ring-2 focus:ring-amber-400 outline-none"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="text-sm text-gray-600"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-full bg-gradient-to-r
                       from-amber-400 to-orange-500 text-white font-semibold
                       shadow-lg hover:scale-105 transition-all"
          >
            Add Recipe 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

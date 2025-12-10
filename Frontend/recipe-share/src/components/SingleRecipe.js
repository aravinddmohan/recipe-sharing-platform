import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SingleRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get(`${process.env.REACT_APP_API_URL}/usersinglerecipe/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Recipe failed to load 😢");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-8 text-lg">Loading...</p>;
  if (!recipe) return <p className="p-8">No recipe found</p>;

  // ✅ CLEAN INGREDIENTS
  const ingredients = recipe.ingredients.split(",");

  // ✅ FIXED STEPS
  const steps = recipe.steps
    .split(/\n|\. |\r|>/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <>
      {/* 🌄 BACKGROUND */}
      <div
        className="min-h-screen relative px-6 py-10"
        style={{
          backgroundImage: "url('/assets/doodle.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🌫 BLUR LAYER */}
        <div className="absolute inset-0 backdrop-blur-md bg-white/65"></div>

        {/*  PAGE CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto">

          {/*  BACK BUTTON */}
          <button
            onClick={() => navigate("/home")}
            className="mb-6 px-5 py-2
                       bg-yellow-400 hover:bg-yellow-300
                       text-gray-900 font-semibold
                       rounded-full shadow transition"
          >
            ← Back to Home
          </button>

          {/* 🧾 CARD */}
          <div className="bg-white/85 backdrop-blur-xl
                          rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)]
                          overflow-hidden grid grid-cols-1 md:grid-cols-2">

            {/*  IMAGE */}
            <div className="p-6">
              <img
                src={`http://127.0.0.1:8000${recipe.image}`}
                alt={recipe.recipe_name}
                className="w-full h-full max-h-[420px]
                           object-cover rounded-2xl shadow-lg
                           hover:scale-[1.01] transition"
              />
            </div>

            {/* 📖 DETAILS */}
            <div className="p-8 flex flex-col justify-center">

              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                {recipe.recipe_name}
              </h1>

              <p className="text-sm text-gray-500 mb-3">
                Created by{" "}
                <span className="font-semibold text-gray-800">
                  {recipe.username}
                </span>
              </p>

              {/* 🏷 TAGS */}
              <div className="flex gap-3 flex-wrap mb-6">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {recipe.difficulty}
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  👁 {recipe.views} views
                </span>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  ⏱ {recipe.cooking_time} mins
                </span>
              </div>

              {/*  INGREDIENTS */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  🧂 Ingredients
                </h2>

                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                  {ingredients.map((item, i) => (
                    <li key={i}>{item.trim()}</li>
                  ))}
                </ul>
              </div>

              {/*  STEPS */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  👨‍🍳 Steps
                </h2>

                <ol className="list-decimal ml-5 mt-3 space-y-3 text-gray-700 leading-relaxed">
                  {steps.map((step, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

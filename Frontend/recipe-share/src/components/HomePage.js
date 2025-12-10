import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 6;
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const API = process.env.REACT_APP_API_URL;

  // Global auth
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch all recipes
  useEffect(() => {
    axios
      .get(`${API}/allrecipelist/?page=${page}`, {
        headers: { Authorization: token ? `Token ${token}` : "" },
      })
      .then((res) => {
        setRecipes(res.data.results);
        setTotalPages(Math.ceil(res.data.count / pageSize));
        setError("");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          setError("Failed to load recipes.");
        }
      });
  }, [page, token, navigate, API]);

  // trending recipe
  useEffect(() => {
    axios
      .get(`${API}/trending/`, {
        headers: { Authorization: token ? `Token ${token}` : "" },
      })
      .then((res) => setTrending(res.data))
      .catch(() => console.log("Trending fetch failed"));
  }, [token, API]);

  const filteredRecipes = recipes.filter((r) =>
    r.recipe_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f3ee] via-[#ebe7df] to-[#f5f1eb] font-sans">

      <NavBar />

      <main className="max-w-7xl mx-auto p-6">

        {error && (
          <p className="text-red-600 text-center mb-4 animate-pulse">
            {error}
          </p>
        )}

        {/* SEARCH */}
        <div className="mb-14 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full px-6 py-3 rounded-full bg-white shadow-md
                         placeholder:text-gray-400
                         focus:outline-none focus:ring-2
                         focus:ring-[#c7d2b5]/60 transition
                         hover:shadow-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* CUTE ICON */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* TRENDING */}
        {trending.length > 0 && (
          <section className="mb-20 rounded-3xl bg-white/70 backdrop-blur-lg p-6 shadow-inner">

            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-['BBH_Sans_Bartle'] text-xl tracking-wide text-[#2a2a2a]">
                🔥 Trending Right Now
              </h2>
              <div className="h-[3px] w-24 bg-[#c7d2b5] rounded-full mt-1"></div>
            </div>

            <div className="flex gap-11 overflow-x-auto pb-4 scrollbar-hide">
              {trending.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="min-w-[260px] rounded-2xl overflow-hidden cursor-pointer
                             bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                             hover:scale-[1.04] hover:rotate-[0.3deg]
                             transition-all"
                >
                  <img
                    src={`${API}${recipe.image}`}
                    alt={recipe.recipe_name}
                    className="w-full h-40 object-cover brightness-[1.05]"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-[#1f2933] leading-snug">
                      {recipe.recipe_name}
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-1 font-medium">
                      👁 {recipe.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="rounded-3xl overflow-hidden cursor-pointer
                         bg-white shadow-[0_15px_35px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_20px_45px_rgba(0,0,0,0.15)]
                         transition-all hover:-translate-y-[2px]"
            >
              <img
                src={`${API}${recipe.image}`}
                alt={recipe.recipe_name}
                className="w-full h-48 object-cover brightness-[1.03] contrast-[1.05]"
                onError={(e) => (e.target.style.display = "none")}
              />

              <div className="p-6">
                <h3 className="text-base font-semibold leading-snug text-[#1f2933]">
                  {recipe.recipe_name}
                </h3>

                <p className="text-xs text-[#6b7280] mt-1">
                  Created by {recipe.username}
                </p>

                <div className="flex gap-2 mt-4 text-xs">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                    {recipe.difficulty}
                  </span>

                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                    ⏱ {recipe.cooking_time} mins
                  </span>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    👁 {recipe.views}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredRecipes.length === 0 && !error && (
            <p className="text-gray-500 col-span-3 text-center">
              No recipes found 😢
            </p>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-6 mt-16">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-6 py-2 rounded-full bg-white shadow hover:bg-gray-50
                       disabled:opacity-40 transition"
          >
            Prev
          </button>

          <span className="px-4 py-2 font-semibold text-[#444]">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 rounded-full bg-white shadow hover:bg-gray-50
                       disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>

      </main>
    </div>
  );
}

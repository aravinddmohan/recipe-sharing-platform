import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMsg("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    axios
      .post(`${API}/signup/`, form)
      .then((res) => {
        const message = res.data?.message || "Signup successful";
        setMsg("✅ " + message);

        // ✅ REDIRECT AFTER 1.5 SECONDS
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
        setMsg("❌ Signup failed. Try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7ecef] via-[#f5f3ef] to-[#ebe6dd] p-6 font-sans">

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 backdrop-blur-xl bg-white/80 shadow rounded-3xl overflow-hidden">

        <div className="p-10 flex flex-col justify-center">

          <h2 className="text-4xl font-semibold text-[#1f2933]">
            CREATE ACCOUNT 🍜
          </h2>

          <p className="text-sm text-[#4b5563] mt-2 mb-6">
            Join RecipeVerse.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-amber-500 text-white"
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {msg && (
            <p className="mt-4 text-sm text-center">
              {msg}
            </p>
          )}

          <p className="mt-4 text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

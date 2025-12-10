import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

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
        const message = (res.data?.message || "Signup completed.").toString();
        setMsg(message);

        // backend sends: "user created successsfully"
        if (message.toLowerCase().includes("success")) {
          // reset form
          setForm({ name: "", email: "", password: "" });
          setMsg("🍜 Account created! Redirecting to login…");

          // redirect to login after short delay
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);
        const backendMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Signup failed. Please try again.";
        setMsg(backendMsg);
      })
      .finally(() => setIsSubmitting(false));
  };

  const isSuccess =
    msg &&
    (
      msg.toLowerCase().includes("success") ||
      msg.toLowerCase().includes("welcome") ||
      msg.toLowerCase().includes("redirecting")
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7ecef] via-[#f5f3ef] to-[#ebe6dd] p-6 font-sans">
      <div
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2
                      backdrop-blur-xl bg-white/80
                      shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                      border border-white/60 rounded-3xl overflow-hidden"
      >
        {/* LEFT GIF */}
        <div
          className="hidden md:flex items-center justify-center 
                        bg-white/30 backdrop-blur-lg p-10"
        >
          <div
            className="bg-white rounded-2xl p-4 
                          shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                          hover:scale-105 transition-transform duration-300"
          >
            <img
              src="/assets/signup.gif"
              alt="signup ramen animation"
              className="w-75 h-auto rounded-xl object-cover"
            />
          </div>
        </div>

        {/* FORM */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="font-['BBH_Sans_Bartle'] text-4xl font-semibold text-[#1f2933]">
            CREATE ACCOUNT 🍜
          </h2>

          <p className="text-[#4b5563] mt-2 mb-6 font-semibold text-sm leading-relaxed">
            Join us and unleash your recipes on the world.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              autoFocus
              className="w-full px-5 py-3 rounded-xl bg-white/90 border border-gray-300
                         focus:border-[#c7d2b5] focus:ring-2 focus:ring-[#c7d2b5]/50
                         outline-none transition-all text-sm font-sans"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full px-5 py-3 rounded-xl bg-white/90 border border-gray-300
                         focus:border-[#c7d2b5] focus:ring-2 focus:ring-[#c7d2b5]/50
                         outline-none transition-all text-sm font-sans"
            />

            <input
              name="password"
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-5 py-3 rounded-xl bg-white/90 border border-gray-300
                         focus:border-[#c7d2b5] focus:ring-2 focus:ring-[#c7d2b5]/50
                         outline-none transition-all text-sm font-sans"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-['BBH_Sans_Bartle'] w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500
                         hover:from-amber-500 hover:to-amber-600
                         text-white font-semibold shadow-md hover:shadow-lg
                         transition-all duration-200 active:scale-95
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating magic..." : "SIGN UP"}
            </button>
          </form>

          {msg && (
            <p
              className={`mt-5 text-xs md:text-sm font-semibold p-3 rounded-xl border ${
                isSuccess
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-red-700 bg-red-50 border-red-200"
              }`}
            >
              {msg}
            </p>
          )}

          {/* SWITCH LINK */}
          <p className="mt-4 text-xs text-[#6b7280]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

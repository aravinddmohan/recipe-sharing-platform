import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMsg("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    axios
      .post("http://localhost:8000/userlogin/", form)
      .then((res) => {
        setMsg("Login successful...");

        if (res.data.token) {
          localStorage.setItem("authToken", res.data.token);
        }

        setTimeout(() => {
          navigate("/home");
        }, 1200);
      })
      .catch(() => {
        setMsg("Invalid login credentials");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-[#e7ecef] via-[#f5f3ef] to-[#ebe6dd] 
                    p-6 font-sans">

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2
                      backdrop-blur-xl bg-white/80
                      shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                      border border-white/60 rounded-3xl overflow-hidden">

        {/* LEFT GIF */}
        <div className="hidden md:flex items-center justify-center 
                        bg-white/30 backdrop-blur-lg p-10">
          <div className="bg-white rounded-2xl p-4 
                          shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                          hover:scale-105 transition-transform duration-300">
            <img
              src="/assets/login.gif"
              alt="Login ramen animation"
              className="w-72 h-auto rounded-xl object-cover"
            />
          </div>
        </div>

        {/* FORM */}
        <div className="p-10 flex flex-col justify-center">

          <h2 className="font-['BBH_Sans_Bartle'] text-4xl font-semibold text-[#1f2933]">
            Welcome Back 👋
          </h2>

          <p className="text-[#4b5563] mt-2 mb-6 font-semibold text-sm leading-relaxed">
            Log in to continue exploring and sharing recipes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              className="w-full px-5 py-3 rounded-xl
                         bg-white/90 border border-gray-300
                         focus:border-[#c7d2b5]
                         focus:ring-2 focus:ring-[#c7d2b5]/50
                         outline-none transition-all text-sm font-sans"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-5 py-3 rounded-xl
                         bg-white/90 border border-gray-300
                         focus:border-[#c7d2b5]
                         focus:ring-2 focus:ring-[#c7d2b5]/50
                         outline-none transition-all text-sm font-sans"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-['BBH_Sans_Bartle']
                         w-full py-3 rounded-full
                         bg-gradient-to-r from-amber-400 to-amber-500
                         hover:from-amber-500 hover:to-amber-600
                         text-white font-semibold
                         shadow-md hover:shadow-lg
                         transition-all duration-200
                         active:scale-95
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging you in..." : "Login"}
            </button>

          </form>

          {msg && (
            <p className={`mt-5 text-xs md:text-sm font-semibold 
                           p-3 rounded-xl border
              ${
                msg.toLowerCase().includes("success")
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-red-700 bg-red-50 border-red-200"
              }`}>
              {msg}
            </p>
          )}

          {/* SWITCH LINK */}
          <p className="mt-4 text-xs text-[#6b7280]">
            New here?{" "}
            <Link
              to="/signup"
              className="text-amber-600 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

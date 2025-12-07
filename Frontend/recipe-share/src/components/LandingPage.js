import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/videos/landing_10s.mp4" type="video/mp4" />
      </video>

      {/* Warm Glass Overlay */}
      <div className="absolute inset-0 bg-[#2a231c]/60 backdrop-blur-sm -z-10"></div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full text-center text-[#d6d3cd] px-6 animate-fadeIn">

        {/* Brand — BBH only */}
        <h1 className="font-['BBH_Sans_Bartle'] text-6xl md:text-7xl font-semibold tracking-wider drop-shadow-xl">
          RecipeVerse 🍜
        </h1>

        {/* Accent — Rubik Mono One */}
        <p className="mt-3 font-['Rubik_Mono_One'] uppercase text-[10px] md:text-xs tracking-[0.35em] text-[#d6d3cd] opacity-90">
          Discover · Create · Share
        </p>

        {/* Body — clean font */}
        <p className="mt-2 text-sm md:text-base font-['Rubik_Mono_One'] text-[#cfcfcf] max-w-xl leading-relaxed">
          From hostel hacks to heritage recipes — the internet’s kitchen, unlocked.
        </p>

        {/* Buttons — UI font */}
        <div className="mt-10 flex gap-6">
          <Link
            to="/signup"
            className=" font-['BBH_Sans_Bartle'] px-8 py-3 rounded-full 
                       bg-[#c7d2b5] text-[#1f1f1b] font-semibold tracking-wide
                       hover:bg-[#b7c4a3]
                       transition-all duration-300 hover:scale-105 shadow-md"
          >
            Sign Up
          </Link>

          <Link
            to="/login"
            className=" font-['BBH_Sans_Bartle'] px-8 py-3 rounded-full 
                       border border-[#e0e0e0]/60
                       text-[#f5f3ef] font-semibold tracking-wide
                       hover:bg-white/10 
                       transition-all duration-300 hover:scale-105"
          >
            Log In
          </Link>
        </div>

        {/* Meta — quiet luxury */}
        <div className="absolute bottom-8 flex gap-10 text-xs tracking-widest uppercase text-[#c5c2ba] font-sans opacity-90">
          <span>1,200 recipes</span>
          <span>14 countries</span>
          <span>Real kitchens</span>
        </div>

      </div>
    </div>
  );
}

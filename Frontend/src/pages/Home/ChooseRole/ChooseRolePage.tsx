import { Link } from "react-router-dom";
import { Plane, Store } from "lucide-react";

export default function ChooseRolePage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo in top-left corner */}
      <div className="absolute top-8 left-8 z-50">
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="OffWeGo"
            className="h-10 w-auto drop-shadow-xl"
          />
        </Link>
      </div>

      {/* Back to Home in top-right corner */}
      <div className="absolute top-8 right-8 z-50">
        <Link
          to="/"
          className="text-gray-800 font-serif text-sm bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-lg"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Left Side - Traveler */}
      <Link
        to="/signup"
        className="w-full md:w-1/2 relative group overflow-hidden"
        style={{
          backgroundImage: 'url("/images/girltravel.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 transition-all duration-500" style={{ backgroundColor: 'rgba(181, 231, 211, 0.5)' }}></div>

        {/* Content */}
        <div className="relative z-10 h-screen flex flex-col items-center justify-center p-12 text-center">
          <div className="transform group-hover:scale-105 transition-transform duration-500">
            <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto border-2 border-gray-300 group-hover:bg-emerald-800 group-hover:border-emerald-800 transition-all duration-500">
              <Plane className="w-12 h-12 text-gray-800 group-hover:text-white transition-colors duration-500" />
            </div>

            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 tracking-tight">
              I'm a Traveler
            </h1>

            <p className="text-gray-700 text-lg md:text-xl font-serif max-w-md mx-auto mb-8 leading-relaxed">
              Explore the world, discover unique experiences, and create unforgettable memories
            </p>

            <div className="inline-flex items-center gap-2 text-gray-800 font-semibold text-sm uppercase tracking-widest border-2 border-gray-800 px-8 py-4 rounded-full group-hover:bg-emerald-800 group-hover:border-emerald-800 transition-all duration-300" style={{ color: '#1f2937' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}>
              Start Your Journey
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #6ee7b7, #34d399, #10b981)' }}></div>
      </Link>

      {/* Right Side - Partner */}
      <Link
        to="/vendor/signup"
        className="w-full md:w-1/2 relative group overflow-hidden"
        style={{
          backgroundImage: 'url("/images/vLogin.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 transition-all duration-500" style={{ backgroundColor: 'rgba(212, 197, 249, 0.5)' }}></div>

        {/* Content */}
        <div className="relative z-10 h-screen flex flex-col items-center justify-center p-12 text-center">
          <div className="transform group-hover:scale-105 transition-transform duration-500">
            <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto border-2 border-gray-300 group-hover:bg-purple-800 group-hover:border-purple-800 transition-all duration-500">
              <Store className="w-12 h-12 text-gray-800 group-hover:text-white transition-colors duration-500" />
            </div>

            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 tracking-tight">
              I'm a Partner
            </h1>

            <p className="text-gray-700 text-lg md:text-xl font-serif max-w-md mx-auto mb-8 leading-relaxed">
              Grow your business, reach global travelers, and showcase your offerings
            </p>

            <div className="inline-flex items-center gap-2 text-gray-800 font-semibold text-sm uppercase tracking-widest border-2 border-gray-800 px-8 py-4 rounded-full group-hover:bg-purple-800 group-hover:border-purple-800 transition-all duration-300" style={{ color: '#1f2937' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}>
              Join as Partner
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #c4b5fd, #a78bfa, #8b5cf6)' }}></div>
      </Link>

      {/* Already have account - Floating */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <p className="text-gray-800 font-serif drop-shadow-lg text-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline text-gray-900">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated: isVendorAuthenticated } = useSelector((state: RootState) => state.vendorAuth);

  useEffect(() => {
    document.title = "404 — Page not found";
  }, []);

  const handleBackToHome = () => {
    // Redirect based on authentication status
    if (isVendorAuthenticated) {
      navigate("/vendor/profile"); // Vendor home
    } else if (isAuthenticated) {
      navigate("/"); // User home
    } else {
      navigate("/"); // Default to user home for unauthenticated users
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-grid-pattern animate-grid-scroll"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float-particle"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400 rounded-full animate-float-particle animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-gray-300 rounded-full animate-float-particle animation-delay-4000"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white rounded-full animate-float-particle animation-delay-3000"></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Glitch Effect 404 */}
        <div className="mb-12 relative">
          <div className="text-9xl font-black text-white relative inline-block animate-glitch-main">
            404
            <div className="absolute top-0 left-0 text-9xl font-black text-gray-400 opacity-70 animate-glitch-1">
              404
            </div>
            <div className="absolute top-0 left-0 text-9xl font-black text-gray-600 opacity-70 animate-glitch-2">
              404
            </div>
          </div>
          
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-scan"></div>
          </div>
        </div>

        {/* Dog Illustration - Monochrome Style */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <svg
              width="240"
              height="240"
              viewBox="0 0 200 200"
              className="drop-shadow-2xl filter brightness-110"
            >
              {/* Glow effect behind dog */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="dogGradient">
                  <stop offset="0%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </radialGradient>
              </defs>
              
              {/* Shadow */}
              <ellipse
                cx="100"
                cy="175"
                rx="60"
                ry="8"
                fill="#000000"
                opacity="0.3"
                className="animate-pulse-shadow"
              />
              
              {/* Dog Body */}
              <ellipse
                cx="100"
                cy="145"
                rx="45"
                ry="35"
                fill="url(#dogGradient)"
                filter="url(#glow)"
                className="animate-gentle-bounce"
              />
              
              {/* Dog Legs */}
              <rect x="75" y="165" width="12" height="25" rx="6" fill="#9ca3af" className="animate-gentle-bounce"/>
              <rect x="113" y="165" width="12" height="25" rx="6" fill="#9ca3af" className="animate-gentle-bounce"/>
              
              {/* Dog Head */}
              <g className="origin-center">
                <circle cx="100" cy="85" r="45" fill="url(#dogGradient)" filter="url(#glow)" />
                
                {/* Dog Ears */}
                <ellipse
                  cx="68"
                  cy="68"
                  rx="18"
                  ry="38"
                  fill="#6b7280"
                  transform="rotate(-25 68 68)"
                  className="animate-ear-wiggle"
                />
                <ellipse
                  cx="132"
                  cy="68"
                  rx="18"
                  ry="38"
                  fill="#6b7280"
                  transform="rotate(25 132 68)"
                  className="animate-ear-wiggle animation-delay-500"
                />
                
                {/* Inner ears */}
                <ellipse
                  cx="68"
                  cy="72"
                  rx="10"
                  ry="22"
                  fill="#4b5563"
                  transform="rotate(-25 68 72)"
                  className="animate-ear-wiggle"
                />
                <ellipse
                  cx="132"
                  cy="72"
                  rx="10"
                  ry="22"
                  fill="#4b5563"
                  transform="rotate(25 132 72)"
                  className="animate-ear-wiggle animation-delay-500"
                />
                
                {/* Dog Snout */}
                <ellipse cx="100" cy="98" rx="28" ry="22" fill="#d1d5db" />
                
                {/* Dog Nose */}
                <ellipse cx="100" cy="98" rx="10" ry="8" fill="#1f2937" className="animate-pulse-slow" />
                
                {/* Dog Eyes - Squinting/Confused */}
                <g className="animate-blink">
                  <ellipse cx="85" cy="75" rx="8" ry="10" fill="#1f2937" />
                  <ellipse cx="85" cy="72" rx="3" ry="4" fill="#ffffff" opacity="0.8" />
                </g>
                <g className="animate-blink animation-delay-200">
                  <ellipse cx="115" cy="75" rx="8" ry="10" fill="#1f2937" />
                  <ellipse cx="115" cy="72" rx="3" ry="4" fill="#ffffff" opacity="0.8" />
                </g>
                
                {/* Eyebrows - Worried expression */}
                <path
                  d="M 78 68 Q 85 65 92 68"
                  stroke="#4b5563"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-eyebrow"
                />
                <path
                  d="M 108 68 Q 115 65 122 68"
                  stroke="#4b5563"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-eyebrow"
                />
                
                {/* Mouth */}
                <path
                  d="M 90 108 Q 100 106 110 108"
                  stroke="#4b5563"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              
              {/* Animated Paw doing facepalm */}
              <g className="animate-dramatic-facepalm" style={{ transformOrigin: '125px 85px' }}>
                <ellipse
                  cx="125"
                  cy="85"
                  rx="18"
                  ry="24"
                  fill="#d1d5db"
                  transform="rotate(-35 125 85)"
                  filter="url(#glow)"
                />
                {/* Paw pads */}
                <circle cx="122" cy="82" r="4" fill="#6b7280" />
                <circle cx="127" cy="79" r="3.5" fill="#6b7280" />
                <circle cx="119" cy="88" r="3.5" fill="#6b7280" />
                <ellipse cx="124" cy="88" rx="6" ry="4" fill="#6b7280" />
              </g>
              
              {/* Stress lines */}
              <path d="M 140 60 L 148 52" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" className="animate-stress-line"/>
              <path d="M 145 70 L 155 68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" className="animate-stress-line animation-delay-300"/>
              <path d="M 142 80 L 152 82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" className="animate-stress-line animation-delay-600"/>
            </svg>

            {/* Floating "..." thought bubble */}
            <div className="absolute -right-4 top-8 animate-thought-bubble">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-2xl relative border-2 border-gray-300">
                <span className="text-2xl font-bold text-gray-800 tracking-wider">...</span>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <div className="absolute -bottom-5 -left-5 w-2.5 h-2.5 bg-white border-2 border-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl p-10 mb-8 backdrop-blur-xl relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 animate-shine"></div>
          
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Oops! Lost in Space
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Even our confused pup can't sniff out this page. It seems to have vanished into the digital void. 
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleBackToHome}
              
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white bg-white text-gray-900 hover:bg-gray-100 transform transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {isVendorAuthenticated ? "Back to Dashboard" : isAuthenticated ? "Back to Home" : "Back to Home"}
            </button>

          </div>

          {/* Search Box */}
        
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm">
          Think something's broken?{" "}
         
        </p>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes grid-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(-3px, -2px); }
          60% { transform: translate(3px, 2px); }
          80% { transform: translate(3px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes dramatic-facepalm {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-8px, 3px) rotate(-10deg); }
          30% { transform: translate(-25px, 0px) rotate(-25deg); }
          50% { transform: translate(-28px, -2px) rotate(-28deg); }
          65% { transform: translate(-25px, 0px) rotate(-25deg); }
          80% { transform: translate(-8px, 3px) rotate(-10deg); }
        }
        
        @keyframes ear-wiggle {
          0%, 100% { transform: rotate(var(--base-rotation, 0deg)); }
          50% { transform: rotate(calc(var(--base-rotation, 0deg) + 8deg)); }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes thought-bubble {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-8px) scale(1.05); opacity: 0.9; }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          25% { transform: translate(10px, -20px); opacity: 0.6; }
          50% { transform: translate(5px, -40px); opacity: 0.8; }
          75% { transform: translate(-5px, -60px); opacity: 0.4; }
          100% { transform: translate(0, -80px); opacity: 0; }
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.3; }
          50% { transform: scaleX(1.1); opacity: 0.2; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        
        @keyframes eyebrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes stress-line {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.9); }
        }
        
        .animate-grid-scroll { animation: grid-scroll 20s linear infinite; }
        .animate-glitch-1 { animation: glitch-1 3s infinite; }
        .animate-glitch-2 { animation: glitch-2 2.5s infinite; }
        .animate-dramatic-facepalm { animation: dramatic-facepalm 3s ease-in-out infinite; }
        .animate-ear-wiggle { animation: ear-wiggle 2s ease-in-out infinite; }
        .animate-gentle-bounce { animation: gentle-bounce 3s ease-in-out infinite; }
        .animate-thought-bubble { animation: thought-bubble 3s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 6s ease-in-out infinite; }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-shine { animation: shine 3s ease-in-out infinite; }
        .animate-pulse-shadow { animation: pulse-shadow 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-blink { animation: blink 4s ease-in-out infinite; }
        .animate-eyebrow { animation: eyebrow 3s ease-in-out infinite; }
        .animate-stress-line { animation: stress-line 2s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
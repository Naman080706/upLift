"use client";

import Loader from "@/components/ui/loader-4";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";

export default function LoadingPage() {
  return (
    <RadialGlowBackground darker className="text-white">
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6">
        {/* Ripple grid loader */}
        <div className="relative z-10 mb-10">
          <Loader />
        </div>

        {/* Title */}
        <h2 className="relative z-10 text-3xl font-black mb-3 bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] bg-clip-text text-transparent tracking-tight text-center">
          Consulting the Engine...
        </h2>

        {/* Subtitle */}
        <p className="relative z-10 text-gray-500 text-center max-w-sm text-sm leading-relaxed">
          Matching your idea against 50,000+ startups and calculating feasibility, innovation &amp; risk scores.
        </p>

        {/* Animated dots */}
        <div className="relative z-10 flex gap-1.5 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#FC0B0B]"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </RadialGlowBackground>
  );
}

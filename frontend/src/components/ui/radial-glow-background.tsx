"use client";

import { cn } from "@/lib/utils";

interface RadialGlowBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  darker?: boolean;
}

export const RadialGlowBackground = ({ className, children, darker = false }: RadialGlowBackgroundProps) => {
  return (
    <div className={cn("min-h-screen w-full relative overflow-hidden", darker ? "bg-[#030303]" : "bg-[#080808]", className)}>

      {/* Primary radial glow — deep red at top center */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: darker
            ? `radial-gradient(circle 500px at 50% 0px, rgba(252,11,11,0.09), transparent)`
            : `radial-gradient(circle 600px at 50% 0px, rgba(252,11,11,0.18), transparent)`,
        }}
      />

      {/* Secondary amber glow — bottom left */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: darker
            ? `radial-gradient(circle 400px at 10% 100%, rgba(250,164,26,0.06), transparent)`
            : `radial-gradient(circle 500px at 10% 100%, rgba(250,164,26,0.12), transparent)`,
        }}
      />

      {/* Tertiary red glow — top right */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: darker
            ? `radial-gradient(circle 300px at 90% 20%, rgba(224,10,10,0.05), transparent)`
            : `radial-gradient(circle 400px at 90% 20%, rgba(224,10,10,0.10), transparent)`,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default RadialGlowBackground;

"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { Wrench, Lightbulb, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";

export default function MetricsPage() {
  const { analysisResult } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) router.push("/dashboard");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const metricInfo: Record<string, { Icon: React.ElementType; color: string; bgColor: string; desc: string }> = {
    feasibility: {
      Icon: Wrench, color: "text-[#8BAE66]", bgColor: "bg-[#8BAE66]/10 border-[#8BAE66]/30",
      desc: "Can this realistically be built? Measures technical complexity, infrastructure needs, and execution barrier."
    },
    innovation: {
      Icon: Lightbulb, color: "text-[#A1D17A]", bgColor: "bg-[#A1D17A]/10 border-[#A1D17A]/30",
      desc: "How novel is this idea? Measures differentiation, originality, and uniqueness vs existing solutions in the market."
    },
    risk: {
      Icon: AlertTriangle, color: "text-[#EBD5AB]", bgColor: "bg-[#EBD5AB]/10 border-[#EBD5AB]/30",
      desc: "What are the chances of failure? Measures market saturation, regulatory risk, and competitive pressure."
    },
  };

  const metricBarColors: Record<string, string> = { feasibility: "#8BAE66", innovation: "#A1D17A", risk: "#EBD5AB" };

  return (
    <RadialGlowBackground darker className="text-white">

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/analysis/results" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-bold">
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          <span className="hidden sm:inline">Analysis</span> Overview
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <NavLogo />
        </div>
        <Link href="/analysis/comparison" className="text-sm text-[#FC0B0B] hover:text-[#fa3a3a] font-bold">
          Comparison →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <div className="text-xs text-[#FC0B0B] uppercase tracking-widest font-bold">Deep Dive</div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <TrendingUp className="w-9 h-9 text-[#FC0B0B]" />
            Metric Breakdown</h1>
          <p className="text-gray-500 text-lg">Understand <em>why</em> each score is what it is — not just what it is.</p>
        </header>

        <div className="space-y-8">
          {Object.entries(analysisResult.metrics).map(([key, data]) => {
            const info = metricInfo[key];
            const toPercent = (v: number) => v > 1 ? Math.round(v) : Math.round(v * 100);
            const score = toPercent(data.score);
            const confidence = toPercent(data.confidence ?? analysisResult.confidence_score);
            return (
              <section key={key} className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-colors">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center ${info?.bgColor ?? "bg-white/10 border-white/20"}`}>
                      {info?.Icon && <info.Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${info.color}`} />}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black capitalize">{key}</h2>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-lg mt-1">{info?.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                    <div className={`text-4xl sm:text-5xl font-black ${info?.color ?? "text-white"}`}>{score}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Confidence: {confidence}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${data.score * 100}%`, backgroundColor: metricBarColors[key] ?? "#888" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Reasoning bullets */}
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">AI Reasoning</div>
                  <ul className="space-y-3">
                    {data.reasoning.map((reason: any, idx: number) => (
                      <ReasoningDropdown key={idx} item={reason} index={idx} color={info?.color ?? "text-gray-400"} />
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>

        {/* Next CTA */}
        <div className="flex gap-4 pt-4">
          <Link href="/analysis/comparison" className="flex-1 bg-[#FC0B0B] hover:bg-[#e00a0a] text-white py-4 rounded-2xl font-bold text-center transition-all shadow-xl shadow-[#FC0B0B]/20 flex items-center justify-center gap-2">
            See Real-World Comparison <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/analysis/summary" className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2">
            Final Summary <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </RadialGlowBackground>
  );
}

function ReasoningDropdown({ item, index, color }: { item: any; index: number; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const isString = typeof item === 'string';
  const point = isString ? item : item.point;
  const details = isString ? null : item.details;

  return (
    <li className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden list-none">
      <div 
        onClick={() => details && setExpanded(!expanded)}
        className={`flex items-start gap-3 px-4 py-3 ${details ? 'cursor-pointer hover:bg-white/[0.04]' : ''}`}
      >
        <span className={`${color} shrink-0 font-bold`}>{index + 1}.</span>
        <div className="flex-1 text-sm text-gray-300 font-medium leading-relaxed">
          {point}
        </div>
        {details && (
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-0.5 shrink-0 px-2 py-1 bg-white/5 rounded-md">
            {expanded ? 'Hide' : 'Details'}
          </span>
        )}
      </div>
      {expanded && details && (
        <div className="px-4 pb-4 pt-1 ml-7 text-sm text-gray-400 leading-relaxed border-t border-white/5 border-dashed mt-1">
          {details}
        </div>
      )}
    </li>
  );
}

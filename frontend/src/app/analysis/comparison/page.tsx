"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { GitCompare, Flame, Check, X, ArrowRight } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";

export default function ComparisonPage() {
  const { analysisResult } = useStore();
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    if (!analysisResult) router.push("/dashboard");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const startups = analysisResult.comparison?.similar_startups ?? [];
  const successCount = startups.filter((s: any) => s.status === "Success").length;
  const successRate = startups.length > 0 ? Math.round((successCount / startups.length) * 100) : 0;

  const failurePatterns = [
    "Poor product-market fit in initial target segment",
    "Ran out of runway before achieving sustainable growth",
    "Underestimated competitive response from incumbents",
    "Unit economics didn't scale at growth stage",
    "Regulatory hurdles slowed down go-to-market",
  ];

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
        <Link href="/analysis/summary" className="text-sm text-[#FC0B0B] hover:text-[#fa3a3a] font-bold">
          Summary →
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <div className="text-xs text-[#FAA41A] uppercase tracking-widest font-bold">Real-World Evidence</div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <GitCompare className="w-9 h-9 text-[#FAA41A]" />
            Startup Comparison
          </h1>
          <p className="text-gray-500 text-lg">Others tried this. Here's what actually happened.</p>
        </header>

        {/* Success rate banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { val: `${successRate}%`, label: "Similar Startups Succeeded", color: "text-[#8BAE66]" },
            { val: `${100 - successRate}%`, label: "Failed in Similar Space", color: "text-red-400" },
            { val: startups.length, label: "Comparable Companies Found", color: "text-[#FAA41A]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center space-y-2">
              <div className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main comparison table */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold">Similar Companies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="pb-4 font-medium">Company</th>
                  <th className="pb-4 font-medium">Industry</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Similarity</th>
                  <th className="pb-4 font-medium">Key Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {startups.map((startup: any, idx: number) => (
                  <React.Fragment key={idx}>
                    <tr onClick={() => setExpandedRow(expandedRow === idx ? null : idx)} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                      <td className="py-5 font-black text-white">{startup.name}</td>
                      <td className="py-5 text-gray-400 text-sm">{startup.industry}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 w-fit ${
                          startup.status === "Success"
                            ? "bg-[#8BAE66]/10 text-[#8BAE66] border border-[#8BAE66]/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {startup.status === "Success" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {startup.status}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#EBD5AB] rounded-full" style={{ width: `${startup.similarity * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{Math.round(startup.similarity * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-5 text-xs text-gray-500 max-w-[200px]">
                        {startup.key_difference ?? (startup.status === "Success" ? "Strong distribution moat" : "Couldn't differentiate from incumbents")}
                      </td>
                    </tr>
                    {expandedRow === idx && (
                      <tr className="bg-black/60">
                        <td colSpan={5} className="p-6 border-l-2 border-[#FC0B0B]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-white">
                            <div className="space-y-2">
                              <h4 className="text-[#8BAE66] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Check className="w-3 h-3" /> Shared Characteristics
                              </h4>
                              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                                {startup.detailed_similarities || "Your core technological architecture and initial beachhead market selection strongly mirror the successful early-stage foundations this company laid during their growth phase."}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-[#FAA41A] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Flame className="w-3 h-3" /> Key Deviations
                              </h4>
                              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                                {startup.detailed_differences || "You are targeting a structurally different pricing model and avoiding the hardware dependencies that ultimately strained their unit economics."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Failure patterns */}
        <section className="bg-red-950/20 border border-red-500/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            Common Failure Patterns
            <span className="text-xs text-red-400 font-normal bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full ml-2">Critical</span>
          </h2>
          <p className="text-sm text-gray-500">These are the most common reasons similar startups failed. Use this as your risk checklist.</p>
          <ul className="space-y-3">
            {failurePatterns.map((pattern, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-black/30 border border-red-500/10 rounded-xl px-4 py-3">
                <span className="text-red-400 font-black shrink-0">{idx + 1}.</span>
                {pattern}
              </li>
            ))}
          </ul>
        </section>

        {/* Navigation */}
        <div className="flex gap-4 pt-4">
          <Link href="/analysis/summary" className="flex-1 bg-[#FC0B0B] hover:bg-[#e00a0a] text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-[#FC0B0B]/20 flex items-center justify-center gap-2">
            See Final Summary <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/analysis/enhance" className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2">
            Enhance My Idea <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </RadialGlowBackground>
  );
}

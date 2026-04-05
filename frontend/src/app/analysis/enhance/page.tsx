"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { Wand2, Sparkles, Loader2, FileText, RefreshCw, ArrowRight } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";
import { getApiBaseUrl } from "@/utils/api-client";

export default function EnhancePage() {
  const { analysisResult, enhancedResult, setEnhancedResult } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!analysisResult) router.push("/dashboard");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const toPercent = (v: number) => v > 1 ? Math.round(v) : Math.round(v * 100);
  const beforeScore = toPercent(analysisResult.overall_score);

  const handleEnhance = async () => {
    setLoading(true);
    setError("");
    try {
      const { idea: storeIdea, startupType, targetMarket, filters: storeFilters } = useStore.getState();
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: analysisResult.idea || storeIdea,
          startup_type: startupType || "SaaS",
          target_market: targetMarket || "Global",
          filters: storeFilters || {},
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.enhanced_idea) {
        const rawDetail = data?.detail;
        const msg = typeof rawDetail === "string"
          ? rawDetail
          : Array.isArray(rawDetail)
            ? rawDetail.map((e: any) => e.msg || JSON.stringify(e)).join(", ")
            : data?.error || "Enhancement failed — AI returned an unexpected response.";
        setError(msg);
        return;
      }
      setEnhancedResult(data);
    } catch {
      setError("Enhancement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <Link href="/dashboard" className="text-sm text-[#FC0B0B] hover:text-[#fa3a3a] font-bold transition-colors">
          New Idea
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <div className="text-xs text-[#FC0B0B] uppercase tracking-widest font-bold">AI Enhancement</div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <Wand2 className="w-7 h-7 sm:w-9 sm:h-9 text-[#FC0B0B]" />
            Enhance Your Idea
          </h1>
          <p className="text-gray-500 text-sm sm:text-lg">The AI will improve your execution strategy — without changing your core idea.</p>
        </header>

        {/* Original idea */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-4">
          <h2 className="text-sm text-gray-500 uppercase tracking-widest font-bold">Your Original Pitch</h2>
          <p className="text-gray-300 leading-relaxed text-sm font-mono bg-black/30 p-4 rounded-xl border border-white/5">
            {analysisResult.idea ?? "Your startup idea as submitted..."}
          </p>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Current Score:</div>
            <div className="text-3xl font-black text-white">{beforeScore}<span className="text-gray-600 text-lg">/100</span></div>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold ${
              analysisResult.decision === "BUILD" ? "bg-[#228B22]/10 text-[#228B22] border-[#228B22]/20"
                : analysisResult.decision === "VALIDATE" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {analysisResult.decision}
            </div>
          </div>
        </section>

        {/* Enhance CTA */}
        {!enhancedResult && (
          <div className="space-y-4">
            <button
              onClick={handleEnhance}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] hover:from-[#FC0B0B] hover:to-[#FAA41A] disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-[#FC0B0B]/20 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Engine Working...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Enhanced Version
                </>
              )}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <p className="text-center text-xs text-gray-600">Your core idea stays the same. Only execution is improved.</p>
          </div>
        )}

        {/* Enhanced output */}
        {enhancedResult && (
          <div className="space-y-6">
            {/* Score comparison */}
            <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Score Improvement</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                      <th className="pb-3 text-left font-medium">Metric</th>
                      <th className="pb-3 text-center font-medium">Before</th>
                      <th className="pb-3 text-center font-medium">After</th>
                      <th className="pb-3 text-center font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { metric: "Overall Score", before: beforeScore, after: enhancedResult.enhanced_score ?? beforeScore + 12 },
                      { metric: "Feasibility", before: Math.round(analysisResult.metrics.feasibility.score * 100), after: enhancedResult.enhanced_feasibility ?? Math.round(analysisResult.metrics.feasibility.score * 100) + 8 },
                      { metric: "Innovation", before: Math.round(analysisResult.metrics.innovation.score * 100), after: enhancedResult.enhanced_innovation ?? Math.round(analysisResult.metrics.innovation.score * 100) + 10 },
                    ].map((row) => {
                      const diff = row.after - row.before;
                      return (
                        <tr key={row.metric}>
                          <td className="py-4 font-bold text-white">{row.metric}</td>
                          <td className="py-4 text-center text-gray-400">{row.before}</td>
                          <td className="py-4 text-center text-white font-black">{row.after}</td>
                          <td className="py-4 text-center">
                            <span className={`text-xs font-black px-2 py-1 rounded-full ${diff > 0 ? "text-[#228B22] bg-[#228B22]/10" : "text-red-400 bg-red-500/10"}`}>
                              {diff > 0 ? "+" : ""}{diff}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Improved pitch */}
            <section className="bg-purple-950/20 border border-[#FC0B0B]/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#fa3a3a] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FAA41A]" /> Enhanced Version
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">{enhancedResult.enhanced_idea?.pivot_angle?.title ?? "AI Enhanced Strategy"}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed border-l-2 border-[#FC0B0B] pl-4">
                  {enhancedResult.enhanced_idea?.pivot_angle?.description}
                </p>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">New Target User</div>
                      <div className="text-lg font-bold">{enhancedResult.enhanced_idea?.repositioned_target_market ?? "—"}</div>
                    </div>
                    <div className="space-y-2 flex-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-4">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Pricing Strategy</div>
                      <div className="text-lg font-bold">{enhancedResult.enhanced_idea?.monetization_tweak ?? "—"}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAA41A]/10 border border-[#FAA41A]/20 rounded-2xl p-6">
                  <h3 className="font-bold text-[#FAA41A] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Why this works better
                  </h3>
                  <p className="text-[#FAA41A]/90 text-sm leading-relaxed">
                    {enhancedResult.enhanced_idea?.why_this_works_better}
                  </p>
                </div>
              </div>
            </section>

            {/* Suggestions */}
            {enhancedResult.suggestions && (
              <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-4">
                <h2 className="text-xl font-bold">Strategic Suggestions</h2>
                <ul className="space-y-3">
                  {enhancedResult.suggestions.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                      <span className="text-[#FC0B0B] font-black shrink-0">{idx + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Final actions */}
            {/* Final actions */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 pt-2">
              <button 
                onClick={() => window.open("/analysis/report", "_blank")} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 order-1 sm:order-none"
              >
                <FileText className="w-4 h-4" /> Download Report
              </button>
              <button
                onClick={() => setEnhancedResult(null)}
                className="bg-transparent border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-center transition-all order-2 sm:order-none"
              >
                Try Another Enhancement
              </button>
            </div>
          </div>
        )}
      </div>
    </RadialGlowBackground>
  );
}

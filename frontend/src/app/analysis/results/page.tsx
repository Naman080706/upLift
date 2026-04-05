"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { CheckCircle2, AlertTriangle, XCircle, BarChart3, GitCompare, LineChart, FileText, Sparkles } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";

import type { PlotParams } from "react-plotly.js";
import type { ComponentType } from "react";

const Plot = dynamic<PlotParams>(
  () => import("react-plotly.js") as Promise<{ default: ComponentType<PlotParams> }>,
  { ssr: false }
);

export default function Results() {
  const { analysisResult } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) router.push("/dashboard");
    // Clear and redirect if result is stale/malformed (missing metrics shape)
    else if (!analysisResult.metrics?.feasibility) router.push("/dashboard");
  }, [analysisResult, router]);

  if (!analysisResult || !analysisResult.metrics?.feasibility) return null;

  // overall_score from Groq is already 0-100 integer; confidence_score is 0.0-1.0 float
  const toPercent = (v: number) => (v > 100 ? 100 : v);
  const score = toPercent(analysisResult.overall_score);
  const confidence = analysisResult.confidence_score > 1 ? Math.round(analysisResult.confidence_score) : Math.round(analysisResult.confidence_score * 100);

  const decisionConfig: Record<string, any> = {
    BUILD: { label: "Build It", Icon: CheckCircle2, iconColor: "text-[#FAA41A]", class: "bg-[#228B22]/10 text-[#228B22] border-[#228B22]/30", glow: "shadow-[#228B22]/10" },
    VALIDATE: { label: "Validate First", Icon: AlertTriangle, iconColor: "text-[#FAA41A]", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", glow: "shadow-yellow-500/10" },
    AVOID: { label: "Avoid", Icon: XCircle, iconColor: "text-[#FC0B0B]", class: "bg-red-500/10 text-red-400 border-red-500/30", glow: "shadow-red-500/10" },
  }[analysisResult.decision] ?? { label: analysisResult.decision, class: "bg-white/10 text-white border-white/20", glow: "" };

  const metricColors: Record<string, string> = { feasibility: "#228B22", innovation: "#228B22", risk: "#EBD5AB" };

  const handleDownloadPDF = () => {
    window.open("/analysis/report", "_blank");
  };

  return (
    <RadialGlowBackground darker className="text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-bold">
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Dashboard
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <NavLogo />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/analysis/metrics" className="hidden sm:block text-xs text-gray-400 hover:text-white transition-colors font-bold px-4 py-2 rounded-xl hover:bg-white/5">
            Deep Dive →
          </Link>
          <button onClick={handleDownloadPDF} className="hidden sm:block text-xs border border-white/10 hover:bg-white/5 px-4 py-2 rounded-xl font-bold text-gray-400 hover:text-white transition-all">
            Export PDF
          </button>
          <Link href="/analysis/enhance" className="bg-[#FC0B0B] hover:bg-[#e00a0a] px-3 py-2 sm:px-4 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FC0B0B]/20 flex items-center gap-1.5 whitespace-nowrap">
            Enhance <span className="hidden sm:inline">Idea</span> <Sparkles className="w-3.5 h-3.5 text-[#FAA41A]" />
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Hero Score Card */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className={`bg-white/[0.04] border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl ${decisionConfig.glow} border-white/10 space-y-4`}>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Overall Score</div>
            <div className="text-8xl font-black text-white">{score}</div>
            <div className="text-2xl font-bold text-gray-400">out of 100</div>
            <div className={`px-5 py-2 rounded-full border flex items-center justify-center gap-2 text-sm font-bold ${decisionConfig.class}`}>
              {decisionConfig.Icon && <decisionConfig.Icon className={`w-4 h-4 ${decisionConfig.iconColor}`} />}
              {decisionConfig.label}
            </div>
          </div>

          {/* Confidence + quick metrics */}
          <div className="md:col-span-2 bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-bold">Metric Breakdown</h2>
              <div className="text-[10px] sm:text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit">
                Confidence: <span className="text-white font-bold">{confidence}%</span>
              </div>
            </div>
            <div className="space-y-5">
              {Object.entries(analysisResult.metrics ?? {}).map(([key, data]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-bold text-gray-200">{key}</span>
                    <span className="font-black" style={{ color: metricColors[key] }}>{Math.round(data.score * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${data.score * 100}%`, backgroundColor: metricColors[key] }} />
                  </div>
                  {/* Advanced dropdown reasoning */}
                  <details className="group pt-2">
                    <summary className="text-xs text-white font-bold cursor-pointer list-none flex items-center gap-1 hover:text-gray-300 transition-colors">
                      <svg className="w-3 h-3 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      Why this score? Let AI explain.
                    </summary>
                    <div className="mt-3 pl-4 border-l border-white/10 space-y-2">
                      {(data.reasoning ?? []).map((item: any, i: number) => (
                        <p key={i} className="text-xs text-gray-400 leading-relaxed">• {typeof item === "string" ? item : item.point}</p>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Chart Analysis Visualization */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 px-2 sm:px-0">
            <BarChart3 className="w-6 h-6 text-[#FC0B0B]"/>
            <h2 className="text-xl sm:text-2xl font-black">Advanced Graph Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Donut Score Breakdown */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/20 transition-all">
              <h3 className="font-bold text-lg mb-4 text-center">Score Breakdown</h3>
              <div className="h-64 mb-4">
                <Plot
                  data={[{
                    type: "pie",
                    hole: 0.7,
                    labels: ["Success Rate", "Market Saturation", "Innovation", "Risk Factor"],
                    values: [
                      analysisResult.comparison?.success_rate ?? 50,
                      100 - ((analysisResult.metrics?.innovation?.score ?? 0.5) * 100),
                      (analysisResult.metrics?.innovation?.score ?? 0) * 100,
                      (analysisResult.metrics?.risk?.score ?? 0) * 100
                    ],
                    marker: { colors: ["#8BAE66", "#334155", "#A1D17A", "#EBD5AB"] },
                    textinfo: "none",
                    hoverinfo: "label+percent"
                  }]}
                  layout={{
                    autosize: true, paper_bgcolor: "transparent", plot_bgcolor: "transparent",
                    margin: { t: 0, b: 0, l: 0, r: 0 },
                    showlegend: false,
                    annotations: [{
                      text: `${score}`, font: { size: 40, color: "white", family: "Inter", weight: "bold" },
                      showarrow: false
                    }]
                  }}
                  config={{ displayModeBar: false }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <details className="mt-auto group border-t border-white/5 pt-4">
                <summary className="text-xs text-gray-400 font-bold cursor-pointer list-none hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  Why this breakdown?
                </summary>
                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white block mb-1">Ratio Balance:</strong>
                  This compares your core metrics proportionally. A massive slice of Risk vs Innovation clearly illustrates structural fragility, while Market Saturation is derived inversely from your Innovation uniqueness.
                </div>
              </details>
            </div>

            {/* Chart 2: Industry Growth Trend */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/20 transition-all">
              <h3 className="font-bold text-lg mb-4 text-center">Industry Growth Trend</h3>
              <div className="h-64 mb-4">
                <Plot
                  data={[{
                    type: "scatter", mode: "lines+markers",
                    x: ["2022", "2023", "2024", "2025", "2026", "2027"],
                    y: [
                      10, 18, 26, 40, 
                      40 + ((analysisResult.metrics?.feasibility?.score ?? 0.5) * 30),
                      50 + ((analysisResult.metrics?.feasibility?.score ?? 0.5) * 50)
                    ],
                    line: { color: "#FAA41A", width: 4, shape: "spline" },
                    marker: { color: "#FC0B0B", size: 8 },
                    fill: 'tozeroy', fillcolor: "rgba(250, 164, 26, 0.1)"
                  }]}
                  layout={{
                    autosize: true, paper_bgcolor: "transparent", plot_bgcolor: "transparent",
                    margin: { t: 10, b: 30, l: 30, r: 10 },
                    xaxis: { showgrid: false, zeroline: false, tickfont: {color: "#888"} },
                    yaxis: { showgrid: true, gridcolor: "rgba(255,255,255,0.05)", zeroline: false, showticklabels: false }
                  }}
                  config={{ displayModeBar: false }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <details className="mt-auto group border-t border-white/5 pt-4">
                <summary className="text-xs text-gray-400 font-bold cursor-pointer list-none hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  Why this projection?
                </summary>
                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white block mb-1">Growth Trajectory:</strong>
                  The baseline traces pre-2025 market compounding. Your projected future climb (2025-2027) is dynamically governed by your AI Feasibility score, showing potential total addressable market capture.
                </div>
              </details>
            </div>

            {/* Chart 3: Opportunity Curve */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/20 transition-all">
              <h3 className="font-bold text-lg mb-4 text-center">Opportunity Curve</h3>
              <div className="h-64 mb-4">
                <Plot
                  data={[
                    // Bell Curve Background
                    {
                      type: "scatter", mode: "lines",
                      x: Array.from({length: 100}, (_, i) => i),
                      y: Array.from({length: 100}, (_, i) => Math.exp(-Math.pow(i - 50, 2) / 200)),
                      line: { color: "rgba(255,255,255,0.2)", width: 2, shape: "spline" },
                      fill: 'tozeroy', fillcolor: "rgba(255,255,255,0.02)",
                      hoverinfo: "none"
                    },
                    // You Are Here Dot
                    {
                      type: "scatter", mode: "text+markers",
                      x: [100 - ((analysisResult.metrics?.innovation?.score ?? 0.5) * 100)],
                      y: [Math.exp(-Math.pow((100 - ((analysisResult.metrics?.innovation?.score ?? 0.5) * 100)) - 50, 2) / 200)],
                      marker: { size: 14, color: "#FC0B0B", line: {color: "#FAA41A", width: 2} },
                      text: ["Your Position "],
                      textposition: "top left",
                      textfont: {color: "white", weight: "bold"}
                    }
                  ]}
                  layout={{
                    autosize: true, paper_bgcolor: "transparent", plot_bgcolor: "transparent",
                    margin: { t: 20, b: 30, l: 10, r: 10 },
                    showlegend: false,
                    xaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: "Early Adopters → Late Majority", font: {size: 10, color:"#666"} } },
                    yaxis: { showgrid: false, zeroline: false, showticklabels: false }
                  }}
                  config={{ displayModeBar: false }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <details className="mt-auto group border-t border-white/5 pt-4">
                <summary className="text-xs text-gray-400 font-bold cursor-pointer list-none hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  Why this position?
                </summary>
                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400 leading-relaxed">
                  <strong className="text-white block mb-1">Market Maturity:</strong>
                  Calculated using your specific Innovation rating. High innovation plots you deep in the 'Early Adopter' left wing (high risk, massive reward). Low innovation places you at the peak of 'Late Majority' saturation.
                </div>
              </details>
            </div>
            
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><GitCompare className="w-5 h-5 text-[#FAA41A]"/> Real-World Comparison</h2>
            <Link href="/analysis/comparison" className="text-xs text-[#FC0B0B] hover:text-[#fa3a3a] transition-colors font-bold">
              Full Comparison Page →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="pb-4 font-medium">Startup</th>
                  <th className="pb-4 font-medium">Industry</th>
                  <th className="pb-4 font-medium">Outcome</th>
                  <th className="pb-4 font-medium">Similarity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {analysisResult.comparison?.similar_startups?.map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/3 transition-colors">
                    <td className="py-4 font-bold text-white">{s.name}</td>
                    <td className="py-4 text-gray-400 text-sm">{s.industry}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === "Success" ? "bg-[#8BAE66]/10 text-[#8BAE66] border border-[#8BAE66]/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#EBD5AB]" style={{ width: `${s.similarity * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(s.similarity * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Navigation to next pages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/analysis/metrics", label: "Detailed Metrics", desc: "Deep score breakdown", Icon: LineChart, color: "text-[#FC0B0B]" },
            { href: "/analysis/comparison", label: "Full Comparison", desc: "Failure patterns", Icon: GitCompare, color: "text-[#FAA41A]" },
            { href: "/analysis/summary", label: "Final Summary", desc: "Decision & bullets", Icon: FileText, color: "text-[#FC0B0B]" },
            { href: "/analysis/enhance", label: "Enhance Idea", desc: "AI improvements", Icon: Sparkles, color: "text-[#FAA41A]" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="bg-white/[0.03] border border-white/10 hover:border-[#FC0B0B]/30 rounded-2xl p-5 space-y-2 transition-all group text-center flex flex-col items-center justify-center">
              <item.Icon className={`w-6 h-6 mb-1 ${item.color}`} />
              <div className="font-bold text-sm group-hover:text-[#fa3a3a] transition-colors">{item.label}</div>
              <div className="text-xs text-gray-600">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </RadialGlowBackground>
  );
}

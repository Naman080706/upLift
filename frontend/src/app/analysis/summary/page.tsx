"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { PlotParams } from "react-plotly.js";
import type { ComponentType } from "react";

const Plot = dynamic<PlotParams>(
  () => import("react-plotly.js") as Promise<{ default: ComponentType<PlotParams> }>,
  { ssr: false }
);
import { NavLogo } from "@/components/NavLogo";
import { CheckCircle2, AlertTriangle, XCircle, Dumbbell, Zap, ShieldAlert, FileText, Sparkles, ClipboardList } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";

export default function SummaryPage() {
  const { analysisResult } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!analysisResult) router.push("/dashboard");
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  // Groq returns overall_score as 0-100 int, confidence_score as 0.0-1.0 float
  const toPercent = (v: number) => v > 1 ? Math.round(v) : Math.round(v * 100);
  const score = toPercent(analysisResult.overall_score);
  const decision = analysisResult.decision;

  const decisionConfig: Record<string, { Icon: React.ElementType; label: string; class: string; bg: string }> = {
    BUILD: { Icon: CheckCircle2, label: "Build It", class: "text-[#228B22] border-[#228B22]/30 bg-[#228B22]/10", bg: "bg-[#228B22]/5 border-[#228B22]/20" },
    VALIDATE: { Icon: AlertTriangle, label: "Validate First", class: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", bg: "bg-yellow-950/20 border-yellow-500/20" },
    AVOID: { Icon: XCircle, label: "Avoid This Idea", class: "text-red-400 border-red-500/30 bg-red-500/10", bg: "bg-red-950/20 border-red-500/10" },
  };

  const decisionConf = decisionConfig[decision] ?? decisionConfig.VALIDATE;

  // dynamically mapping sections from AI instead of hardcoded placeholders
  const dynamicSections = [
    { 
      title: "Feasibility Factors", 
      Icon: Dumbbell, 
      items: analysisResult.metrics?.feasibility?.reasoning || [], 
      itemClass: "text-[#228B22]", 
      bgClass: "border-[#228B22]/20 bg-[#228B22]/5" 
    },
    { 
      title: "Innovation & Differentiation", 
      Icon: Zap, 
      items: analysisResult.metrics?.innovation?.reasoning || [], 
      itemClass: "text-yellow-400", 
      bgClass: "border-yellow-500/10 bg-yellow-950/10" 
    },
    { 
      title: "Critical Risks", 
      Icon: ShieldAlert, 
      items: analysisResult.metrics?.risk?.reasoning || [], 
      itemClass: "text-red-400", 
      bgClass: "border-red-500/10 bg-red-950/10" 
    },
  ];

  const summaryPara1 = analysisResult.summary?.paragraph_1 ??
    `Your startup idea scores ${score}/100 with ${toPercent(analysisResult.confidence_score)}% confidence. The AI engine analyzed your idea against ${analysisResult.comparison?.similar_startups?.length ?? 10}+ comparable startups in the global database and identified both meaningful strengths and critical risk vectors that need addressing.`;

  const summaryPara2 = analysisResult.summary?.paragraph_2 ??
    `The ${decision === "BUILD" ? "strong fundamentals suggest this has real potential if executed with focus." : decision === "VALIDATE" ? "recommendation is to validate key assumptions before committing significant resources. Run lean experiments to test your differentiation hypothesis." : "risk profile is too high at this stage. Consider pivoting the core positioning or targeting a less saturated entry point."}`;

  const handlePrintReport = () => {
    // Open in a new tab so they don't lose the summary context
    window.open("/analysis/report", "_blank");
  };

  return (
    <RadialGlowBackground darker className="text-white">

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/analysis/results" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-bold">
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Analysis Overview
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <NavLogo />
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrintReport} className="hidden sm:block text-sm text-gray-400 hover:text-white font-bold border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
            Export PDF
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <div className="text-xs text-[#FC0B0B] uppercase tracking-widest font-bold">Final Decision</div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <ClipboardList className="w-9 h-9 text-[#FC0B0B]" />
            Analysis Summary
          </h1>
          <p className="text-gray-500 text-lg">Everything you need to decide in one place.</p>
        </header>

        {/* Decision hero */}
        <div className={`relative overflow-hidden border rounded-3xl p-6 sm:p-12 text-center flex flex-col items-center gap-6 ${decisionConf.bg}`}>
          {/* Subtle glow effect behind the ring for a premium look */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-current opacity-10 rounded-full blur-[80px]" />

          <div className="flex gap-4 items-center">
             <decisionConf.Icon className="w-8 h-8 opacity-90" />
             <div className={`inline-block px-5 py-1.5 rounded-full border text-sm font-black uppercase tracking-widest bg-black/40 ${decisionConf.class}`}>
               {decisionConf.label}
             </div>
          </div>

          <div className="relative inline-flex items-center justify-center">
            <svg className="w-56 h-56 transform -rotate-90 drop-shadow-2xl">
              <circle
                cx="112" cy="112" r="100"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-black/50"
              />
              <circle
                cx="112" cy="112" r="100"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-black tabular-nums tracking-tighter text-white drop-shadow-md">
                {score}<span className="text-2xl text-white/40 ml-1 font-bold">/100</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 backdrop-blur-md px-6 py-3 rounded-2xl flex flex-col items-center w-full sm:w-auto">
            <p className="text-gray-400 text-xs sm:text-sm font-bold tracking-wide uppercase">Confidence Level</p>
            <p className="text-white font-black text-base sm:text-lg text-center">
              {toPercent(analysisResult.confidence_score)}% <span className="text-gray-500 font-medium ml-2 text-xs sm:text-sm lowercase block sm:inline">Based on {analysisResult.comparison?.similar_startups?.length ?? "multiple"} comparisons</span>
            </p>
          </div>
        </div>

        {/* Summary paragraphs */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold">Analysis Overview</h2>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{summaryPara1}</p>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{summaryPara2}</p>
        </section>

        {/* All-In-One Radar Graph */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-80">
            <Plot
              data={[{
                type: 'scatterpolar',
                r: [
                  toPercent(analysisResult.metrics?.feasibility?.score ?? 0),
                  toPercent(analysisResult.metrics?.innovation?.score ?? 0),
                  toPercent(analysisResult.metrics?.risk?.score ?? 0),
                  analysisResult.comparison?.success_rate ?? 50,
                  toPercent(analysisResult.metrics?.feasibility?.score ?? 0) // close the shape
                ],
                theta: ['Feasibility', 'Innovation', 'Risk Exposure', 'Success Rate', 'Feasibility'],
                fill: 'toself',
                fillcolor: 'rgba(252, 11, 11, 0.2)',
                line: {
                  color: '#FC0B0B'
                }
              }]}
              layout={{
                autosize: true,
                paper_bgcolor: "transparent",
                polar: {
                  bgcolor: "transparent",
                  radialaxis: {
                    visible: true,
                    range: [0, 100],
                    gridcolor: "rgba(255,255,255,0.1)",
                    tickfont: { color: "#666" }
                  },
                  angularaxis: {
                    tickfont: { color: "#FFF", size: 12, weight: "bold" },
                    gridcolor: "rgba(255,255,255,0.1)"
                  }
                },
                margin: { t: 30, b: 30, l: 40, r: 40 },
                showlegend: false
              }}
              config={{ displayModeBar: false }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-2xl font-black">Strategic Shape</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              This radar chart visualizes the overarching "shape" of your startup. A balanced startup will form a wide, rounded shape, indicating strength across all dimensions. 
            </p>
            <ul className="space-y-3 mt-4 text-sm text-gray-300">
              <li className="flex gap-2"><strong className="text-[#8BAE66]">Feasibility</strong> reflects your capacity to build and launch within the designated {analysisResult.launch_period ?? "6M"} timeframe.</li>
              <li className="flex gap-2"><strong className="text-[#A1D17A]">Innovation</strong> acts as your competitive moat, defending against deep-pocketed incumbents.</li>
              <li className="flex gap-2"><strong className="text-[#EBD5AB]">Risk Exposure</strong> is the inverse force acting against you, largely driven by market saturation.</li>
              <li className="flex gap-2"><strong className="text-white">Success Rate</strong> grounds these abstract metrics into cold, hard historical facts based on similar ventures.</li>
            </ul>
          </div>
        </section>

        {/* Dynamic Metric Reasoning */}
        <div className="space-y-6">
          {dynamicSections.map((section) => (
            <section key={section.title} className={`border rounded-2xl p-6 space-y-4 ${section.bgClass}`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <section.Icon className={`w-4 h-4 ${section.itemClass}`} />
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item: any, idx: number) => {
                  const point = typeof item === "string" ? item : item.point;
                  const details = typeof item === "string" ? "" : item.details;
                  
                  return (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className={`${section.itemClass} font-black shrink-0 mt-0.5`}>•</span>
                      {details ? (
                        <details className="w-full group">
                          <summary className="font-bold hover:text-white transition-colors cursor-pointer list-none flex items-center gap-2">
                             <svg className="w-3 h-3 text-gray-500 group-open:rotate-90 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                             {point}
                          </summary>
                          <p className="mt-3 text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4 py-1 mb-2">{details}</p>
                        </details>
                      ) : (
                        <span>{point}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 pt-4">
          <Link href="/analysis/enhance" className="bg-[#FC0B0B] hover:bg-[#e00a0a] text-white py-4 rounded-2xl font-bold text-center transition-all shadow-xl shadow-[#FC0B0B]/20 flex items-center justify-center gap-2 order-1 sm:order-none">
            <Sparkles className="w-4 h-4" /> Enhance My Idea
          </Link>
          <button onClick={handlePrintReport} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 order-2 sm:order-none">
            <FileText className="w-4 h-4" /> Download Full Report
          </button>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Analyze a different idea
          </Link>
        </div>
      </div>
    </RadialGlowBackground>
  );
}

"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { NavLogo } from "@/components/NavLogo";
import { Sparkles, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PlotParams } from "react-plotly.js";
import type { ComponentType } from "react";

const Plot = dynamic<PlotParams>(
  () => import("react-plotly.js") as Promise<{ default: ComponentType<PlotParams> }>,
  { ssr: false }
);

export default function ReportPage() {
  const { analysisResult, enhancedResult, idea, startupType, targetMarket, filters } = useStore();
  const router = useRouter();
  const printReady = useRef(false);

  useEffect(() => {
    // Wait for Zustand hydration when opening in a new tab
    const timer = setTimeout(() => {
      if (!useStore.getState().analysisResult) {
        router.push("/dashboard");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  const downloadReport = async () => {
    // dynamically import to ensure client-side only
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("pdf-report-container");
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `uplift-report-${Date.now()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: '.page-break-inside-avoid' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
        // Optionally close the window after download completes if opened in new tab
        // window.close();
    });
  };

  useEffect(() => {
    if (analysisResult && !printReady.current) {
      printReady.current = true;
      // Let charts render
      setTimeout(() => {
        downloadReport();
      }, 1500);
    }
  }, [analysisResult]);

  if (!analysisResult) return <div className="min-h-screen bg-white" />;

  // score comes from Groq as 0-100 int (e.g. 82)
  const toPercent = (v: number) => (v > 100 ? 100 : v);
  const score = toPercent(analysisResult.overall_score);
  const decision = analysisResult.decision;

  const decisionConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    BUILD: { label: "Build It", color: "#228B22", bgColor: "rgba(34, 139, 34, 0.1)" },
    VALIDATE: { label: "Validate First", color: "#B45309", bgColor: "rgba(180, 83, 9, 0.1)" },
    AVOID: { label: "Avoid This Idea", color: "#DC2626", bgColor: "rgba(220, 38, 38, 0.1)" },
  };

  const decisionConf = decisionConfig[decision] ?? decisionConfig.VALIDATE;

  const dynamicSections = [
    { title: "Feasibility Factors", items: analysisResult.metrics?.feasibility?.reasoning || [], color: "#228B22" },
    { title: "Innovation & Differentiation", items: analysisResult.metrics?.innovation?.reasoning || [], color: "#B45309" },
    { title: "Critical Risks", items: analysisResult.metrics?.risk?.reasoning || [], color: "#DC2626" },
  ];

  const summaryPara1 = analysisResult.summary?.paragraph_1 ??
    `Your startup idea scores ${score}/100 with ${toPercent(analysisResult.confidence_score)}% confidence. The AI engine analyzed your idea against ${analysisResult.comparison?.similar_startups?.length ?? 10}+ comparable startups in the global database and identified both meaningful strengths and critical risk vectors that need addressing.`;

  const summaryPara2 = analysisResult.summary?.paragraph_2 ??
    `The ${decision === "BUILD" ? "strong fundamentals suggest this has real potential if executed with focus." : decision === "VALIDATE" ? "recommendation is to validate key assumptions before committing significant resources. Run lean experiments to test your differentiation hypothesis." : "risk profile is too high at this stage. Consider pivoting the core positioning or targeting a less saturated entry point."}`;


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "Inter, sans-serif", color: "#111827" }}>

      {/* Non-Printable Nav Bar — Tailwind OK here */}
      <div className="print:hidden sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-50 shadow-sm">
        <Link href="/analysis/summary" className="flex items-center gap-2 text-[#6B7280] hover:text-black font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Summary
        </Link>
        <button onClick={downloadReport} className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">
          <Printer className="w-4 h-4" /> Download PDF
        </button>
      </div>

      {/* A4 PDF Container — 100% inline styles, NO Tailwind classes */}
      <div id="pdf-report-container" style={{ maxWidth: "794px", margin: "0 auto", padding: "48px", backgroundColor: "#ffffff", color: "#111827", position: "relative" }}>

        {/* Watermark */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.03, pointerEvents: "none", userSelect: "none", overflow: "hidden" }}>
          <div style={{ fontSize: "200px", fontWeight: 900, transform: "rotate(-45deg)", color: "#000000", lineHeight: 1 }}>upLIFT</div>
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid #111827", paddingBottom: "24px", marginBottom: "32px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#FC0B0B", marginBottom: "8px" }}>upLIFT</div>
            <h1 style={{ fontSize: "30px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.025em", color: "#111827", margin: "0 0 4px" }}>Analysis Report</h1>
            <p style={{ color: "#6B7280", fontWeight: 500, margin: 0, fontSize: "14px" }}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>Confidential</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>upLIFT Engine</div>
          </div>
        </div>

        {/* Startup Brief */}
        <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Startup Brief</div>
          {idea && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: "6px" }}>Idea / Script</div>
              <p style={{ fontSize: "13px", color: "#1F2937", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{idea}</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginTop: "12px" }}>
            {startupType && (
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "4px" }}>Type</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{startupType}</div>
              </div>
            )}
            {targetMarket && (
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "4px" }}>Target Market</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{targetMarket}</div>
              </div>
            )}
            {filters && Object.entries(filters).map(([key, val]) => val ? (
              <div key={key} style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "4px" }}>{key}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{val}</div>
              </div>
            ) : null)}
          </div>
        </div>

        {/* Decision Hero Section - Mirrors Summary Page */}
        <div style={{ 
          backgroundColor: decisionConf.bgColor, 
          border: `2px solid ${decisionConf.color}33`, 
          borderRadius: "24px", 
          padding: "48px 24px", 
          textAlign: "center", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "24px",
          marginBottom: "48px",
          position: "relative"
        }}>
          <div style={{ 
            display: "inline-block", 
            padding: "6px 20px", 
            borderRadius: "999px", 
            border: `1px solid ${decisionConf.color}`, 
            fontSize: "12px", 
            fontWeight: 900, 
            textTransform: "uppercase", 
            letterSpacing: "0.1em",
            color: decisionConf.color,
            backgroundColor: "#ffffff"
          }}>
            {decisionConf.label}
          </div>

          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: "200px", height: "200px", transform: "rotate(-90deg)" }}>
              <circle cx="100" cy="100" r="90" stroke="#E5E7EB" strokeWidth="12" fill="transparent" />
              <circle 
                cx="100" cy="100" r="90" 
                stroke={decisionConf.color} 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - score / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: 900, color: "#111827", lineHeight: 1 }}>
                {score}<span style={{ fontSize: "16px", color: "#9CA3AF", marginLeft: "2px" }}>/100</span>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: "#ffffff", 
            border: "1px solid #E5E7EB", 
            padding: "12px 24px", 
            borderRadius: "16px", 
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" 
          }}>
            <p style={{ color: "#6B7280", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Confidence Level</p>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: "#111827" }}>
              {toPercent(analysisResult.confidence_score)}% <span style={{ color: "#9CA3AF", fontSize: "12px", fontWeight: 500, marginLeft: "4px" }}>Based on historical match-data</span>
            </p>
          </div>
        </div>

        {/* Overview Paragraphs */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "16px", color: "#111827" }}>Analysis Overview</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#4B5563", marginBottom: "16px" }}>{summaryPara1}</p>
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#4B5563", margin: 0 }}>{summaryPara2}</p>
        </div>

        {/* Strategic Shape Section - Mirrors Summary Page Two-Column Layout */}
        <div style={{ 
          border: "1px solid #E5E7EB", 
          backgroundColor: "#F9FAFB", 
          padding: "24px", 
          borderRadius: "24px", 
          marginBottom: "48px",
          display: "flex",
          gap: "32px",
          pageBreakInside: "avoid"
        }}>
          <div style={{ flex: 1, height: "280px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Strategic Shape</div>
            <div style={{ height: "240px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Plot
                data={[{
                  type: 'scatterpolar',
                  r: [
                    toPercent(analysisResult.metrics?.feasibility?.score ?? 0),
                    toPercent(analysisResult.metrics?.innovation?.score ?? 0),
                    toPercent(analysisResult.metrics?.risk?.score ?? 0),
                    analysisResult.comparison?.success_rate ?? 50,
                    toPercent(analysisResult.metrics?.feasibility?.score ?? 0)
                  ],
                  theta: ['Feasibility', 'Innovation', 'Risk Exposure', 'Success Rate', 'Feasibility'],
                  fill: 'toself',
                  fillcolor: 'rgba(252, 11, 11, 0.1)',
                  line: { color: '#FC0B0B', width: 2 }
                }]}
                layout={{
                  autosize: true, paper_bgcolor: "transparent",
                  polar: {
                    bgcolor: "transparent",
                    radialaxis: { visible: true, range: [0, 100], gridcolor: "#E5E7EB", tickfont: { color: "#9CA3AF", size: 8 } },
                    angularaxis: { tickfont: { color: "#111827", size: 10, weight: 700 }, gridcolor: "#E5E7EB" }
                  },
                  margin: { t: 30, b: 30, l: 30, r: 30 }, showlegend: false
                }}
                config={{ displayModeBar: false, staticPlot: true }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#111827", marginBottom: "12px", marginTop: "4px" }}>Strategic Geometry</h3>
            <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, marginBottom: "16px" }}>
              This radar chart visualizes the overarching "shape" of your startup. A balanced startup will form a wide, rounded shape, indicating strength across all dimensions.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ fontSize: "12px", color: "#4B5563", marginBottom: "8px", display: "flex", gap: "8px" }}>
                <strong style={{ color: "#228B22", minWidth: "75px" }}>Feasibility:</strong> Capacity to build within the {analysisResult.launch_period ?? "6M"} timeframe.
              </li>
              <li style={{ fontSize: "12px", color: "#4B5563", marginBottom: "8px", display: "flex", gap: "8px" }}>
                <strong style={{ color: "#B45309", minWidth: "75px" }}>Innovation:</strong> Competitive moat defending against incumbents.
              </li>
              <li style={{ fontSize: "12px", color: "#4B5563", marginBottom: "8px", display: "flex", gap: "8px" }}>
                <strong style={{ color: "#DC2626", minWidth: "75px" }}>Risk:</strong> Inverse force largely driven by market saturation.
              </li>
              <li style={{ fontSize: "12px", color: "#4B5563", display: "flex", gap: "8px" }}>
                <strong style={{ color: "#111827", minWidth: "75px" }}>Success:</strong> Historical facts based on similar baseline ventures.
              </li>
            </ul>
          </div>
        </div>

        {/* Dynamic Sections */}
        {dynamicSections.map((section: any, idx: number) => (
          <div key={idx} style={{ marginBottom: "40px", pageBreakInside: "avoid" }}>
            <div style={{ borderBottom: `2px solid ${section.color}33`, paddingBottom: "8px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 900, textTransform: "uppercase", color: section.color, margin: 0 }}>{section.title}</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.items.map((item: any, i: number) => {
                const pointStr = typeof item === "string" ? item : (item.point || "");
                const detailsStr = typeof item === "object" ? (item.details || "") : "";
                const fullContent = detailsStr ? `${pointStr}\n\n${detailsStr}` : pointStr;

                return (
                  <li key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ color: section.color, fontWeight: 900, marginTop: "2px", flexShrink: 0 }}>•</span>
                    <div style={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.6 }}>
                      {typeof item !== "string" && item.point && item.details && (
                        <strong style={{ display: "block", color: "#111827", marginBottom: "4px" }}>{item.point}</strong>
                      )}
                      <ReactMarkdown>{detailsStr || pointStr}</ReactMarkdown>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Page Break */}
        <div className="html2pdf__page-break" />

        {/* Market Comparisons */}
        <div style={{ paddingTop: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 900, textTransform: "uppercase", color: "#111827", marginBottom: "24px" }}>Market Comparisons</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {analysisResult.comparison?.similar_startups?.map((s: any, idx: number) => (
              <div key={idx} style={{ border: "1px solid #E5E7EB", padding: "16px", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "17px" }}>{s.name}</div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: s.status === "Success" ? "#228B22" : "#DC2626" }}>{s.status}</div>
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>{s.industry}</div>
                <div style={{ width: "100%", backgroundColor: "#E5E7EB", borderRadius: "999px", height: "6px" }}>
                  <div style={{ backgroundColor: "#FC0B0B", height: "6px", borderRadius: "999px", width: `${s.similarity > 1 ? s.similarity : s.similarity * 100}%` }} />
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px", textAlign: "right" }}>{Math.round(s.similarity > 1 ? s.similarity : s.similarity * 100)}% Match</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Enhancement Section */}
        {enhancedResult && (
          <div style={{ paddingTop: "32px" }}>
            <div className="html2pdf__page-break" />
            <h2 style={{ fontSize: "24px", fontWeight: 900, textTransform: "uppercase", color: "#111827", marginBottom: "24px", marginTop: "32px" }}>AI Enhancements & Pivot Playbook</h2>
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1F2937", marginBottom: "8px", borderLeft: "4px solid #000", paddingLeft: "12px" }}>{enhancedResult.enhanced_idea.pivot_angle.title}</h3>
              <p style={{ color: "#4B5563", marginBottom: "16px", fontSize: "14px" }}>{enhancedResult.enhanced_idea.pivot_angle.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>Target Market Shift</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", marginTop: "4px" }}>{enhancedResult.enhanced_idea.repositioned_target_market}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>Monetization Tweak</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", marginTop: "4px" }}>{enhancedResult.enhanced_idea.monetization_tweak}</div>
                </div>
              </div>
              <div style={{ marginTop: "16px", backgroundColor: "#FEFCE8", color: "#92400E", padding: "16px", borderRadius: "8px", fontSize: "13px", border: "1px solid #FDE68A" }}>
                <strong>Why this works better:</strong> {enhancedResult.enhanced_idea.why_this_works_better}
              </div>
            </div>
            {enhancedResult.suggestions && (
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1F2937", marginBottom: "16px" }}>Strategic Execution Steps</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {enhancedResult.suggestions.map((s: string, idx: number) => (
                    <li key={idx} style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#4B5563", marginBottom: "10px" }}>
                      <span style={{ color: "#FC0B0B", fontWeight: 900 }}>{idx + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { supabaseClient } from "@/utils/supabaseClient";
import { Pencil, Target, Paperclip, ChevronRight, Rocket, User, LogOut, History } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";
import { getApiBaseUrl } from "@/utils/api-client";

function CustomSelect({ label, value, setter, options }: { label: string; value: string; setter: (v: string) => void; options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-2 relative w-full">
      <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white cursor-pointer flex justify-between items-center hover:border-white/20 transition-colors shadow-inner"
      >
        <span className="truncate">{value}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#121212] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 max-h-[96px] overflow-y-auto custom-scrollbar">
            {options.map((o) => (
              <div 
                key={o} 
                onClick={() => { setter(o); setIsOpen(false); }}
                className={`px-4 py-3 text-sm cursor-pointer hover:bg-white/10 transition-colors ${value === o ? "text-[#FC0B0B] font-bold bg-[#FC0B0B]/5 border-l-2 border-[#FC0B0B]" : "text-gray-300 border-l-2 border-transparent"}`}
              >
                {o}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { idea, setIdea, startupType, setStartupType, targetMarket, setTargetMarket, setIsAnalyzing, setAnalysisResult, user, sessionToken, logout } = useStore();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);
  const [industry, setIndustry] = useState("Tech");
  const [revenueModel, setRevenueModel] = useState("Subscription");
  const [stage, setStage] = useState("Idea");
  const [geography, setGeography] = useState("Global");
  const [launchPeriod, setLaunchPeriod] = useState(2); // 0=1M 1=2M 2=6M 3=1Y 4=2Y
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);

    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // Use PDF.js to extract text from PDF
        const pdfjsLib = await import("pdfjs-dist");
        // Use bundled local worker served from /public — avoids CDN version mismatch
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        setIdea(fullText.trim().slice(0, 3000));
      } else {
        // Plain text file
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          setIdea(text.slice(0, 3000));
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("File read error:", err);
    } finally {
      setUploading(false);
    }
  };


  const handleAnalyze = async () => {
    if (!idea || idea.length < 20) return;
    setIsAnalyzing(true);
    router.push("/analysis/loading");
    try {
      // Always fetch a fresh token — the persisted one may be expired
      const { data: { session } } = await supabaseClient.auth.getSession();
      const freshToken = session?.access_token || sessionToken;

      if (!freshToken) {
        router.push("/auth");
        return;
      }

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${freshToken}`
        },
        body: JSON.stringify({
          idea,
          startup_type: startupType,
          target_market: targetMarket,
          filters: { industry, revenue_model: revenueModel, stage, geography },
          launch_period: ["1M", "2M", "6M", "1Y", "2Y"][launchPeriod],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setAnalysisResult(data);
      router.push("/analysis/results");
    } catch (error) {
      console.error("Analysis failed", error);
      router.push("/dashboard");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const charCount = idea?.length ?? 0;
  const isReady = charCount >= 20;

  return (
    <RadialGlowBackground darker className="text-white">

      {/* Nav bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div />
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <NavLogo />
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            AI Engine Ready
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5 text-gray-300" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2" onClick={() => setShowProfileMenu(false)}>
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Account</p>
                  {user?.user_metadata?.first_name ? (
                    <>
                      <p className="text-sm font-bold text-white truncate">
                        {user.user_metadata.first_name} {user.user_metadata.last_name}
                      </p>
                      <p className="text-xs truncate text-gray-500 mt-0.5">{user?.email}</p>
                    </>
                  ) : (
                    <p className="text-sm truncate text-white">{user?.email}</p>
                  )}
                </div>
                <Link href="/dashboard/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                  <History className="w-4 h-4" />
                  Launch History
                </Link>
                <button 
                  onClick={() => { logout(); router.push("/auth"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#FC0B0B] hover:bg-[#FC0B0B]/10 transition-colors text-left border-t border-white/5 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-1 sm:space-y-2">
          <div className="text-[10px] sm:text-xs text-[#FC0B0B] uppercase tracking-widest font-bold">Step 1 of 1</div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Describe your startup idea</h1>
          <p className="text-gray-500 text-sm sm:text-lg">The more context you provide, the more accurate your analysis.</p>
        </header>

        {/* IDEA INPUT */}
        <section className="bg-white/[0.04] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#FC0B0B]/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e00a0a]/15 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-[#FC0B0B]" />
            </div>
            <h2 className="text-xl font-bold">The Core Concept</h2>
          </div>
          <textarea
            className="w-full h-52 bg-black/40 border border-white/5 rounded-2xl p-5 text-base focus:outline-none focus:border-purple-500/40 transition-all resize-none placeholder-gray-600 leading-relaxed"
            placeholder="Describe your startup clearly... What problem are you solving? Who is it for? How? The more detail, the better."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 hover:text-white transition-all w-full sm:w-auto">
                <Paperclip className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-xs">{fileName || (uploading ? "Uploading..." : "Upload PDF/DOCX")}</span>
                <input type="file" accept=".pdf,.docx,.txt" onChange={handleFile} className="hidden" />
              </label>
              <span className="text-xs text-gray-600 shrink-0">Max 10MB</span>
            </div>
            <span className={`text-xs font-mono self-end sm:self-auto ${charCount >= 20 ? "text-green-500" : "text-gray-600"}`}>
              {charCount} chars {charCount < 20 && `(need ${20 - charCount} more)`}
            </span>
          </div>
        </section>

        {/* BASIC FILTERS */}
        <section className="bg-white/[0.04] border border-white/10 p-8 rounded-3xl space-y-6 hover:border-[#FC0B0B]/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAA41A]/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#FAA41A]" />
            </div>
            <h2 className="text-xl font-bold">Context Filters</h2>
            <span className="text-xs text-gray-600 ml-auto">Guides the AI engine — more accurate with filters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Startup Type", value: startupType, setter: setStartupType,
                options: ["SaaS", "Marketplace", "Fintech", "D2C / E-commerce", "Deeptech / AI", "Consumer App", "Healthcare"],
              },
              {
                label: "Target Market", value: targetMarket, setter: setTargetMarket,
                options: ["B2B", "B2C", "B2B2C", "Government", "Enterprise"],
              },
            ].map((f) => (
              <CustomSelect key={f.label} label={f.label} value={f.value} setter={f.setter} options={f.options} />
            ))}
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-[#FC0B0B] hover:text-[#fa3a3a] transition-colors flex items-center gap-1.5 font-bold">
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-90" : ""}`} />
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              {[
                { label: "Industry", value: industry, setter: setIndustry, options: ["Tech", "Fintech", "Health", "Edtech", "Climate", "Logistics", "Agriculture", "Real Estate"] },
                { label: "Revenue Model", value: revenueModel, setter: setRevenueModel, options: ["Subscription", "Freemium", "Marketplace Commission", "One-Time", "Usage-Based", "Ad-Supported"] },
                { label: "Stage", value: stage, setter: setStage, options: ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+"] },
                { label: "Geography", value: geography, setter: setGeography, options: ["Global", "North America", "Europe", "Asia", "India", "MENA", "LatAm"] },
              ].map((f) => (
                <CustomSelect key={f.label} label={f.label} value={f.value} setter={f.setter} options={f.options} />
              ))}

              {/* Launch Period Slider */}
              <div className="col-span-1 sm:col-span-2 pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Expected Launch Period</label>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FC0B0B]/10 text-[#FC0B0B] border border-[#FC0B0B]/20">
                    {["1 Month", "2 Months", "6 Months", "1 Year", "2 Years"][launchPeriod]}
                  </span>
                </div>

                <div className="relative px-1">
                  <input
                    type="range"
                    min={0}
                    max={4}
                    step={1}
                    value={launchPeriod}
                    onChange={(e) => setLaunchPeriod(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none rounded-full cursor-pointer outline-none"
                    style={{
                      background: `linear-gradient(to right, #FC0B0B ${launchPeriod * 25}%, rgba(255,255,255,0.08) ${launchPeriod * 25}%)`
                    }}
                  />
                  {/* Tick Labels */}
                  <div className="flex justify-between mt-3 px-0.5">
                    {["1M", "2M", "6M", "1Y", "2Y"].map((label, i) => (
                      <button
                        key={label}
                        onClick={() => setLaunchPeriod(i)}
                        className={`text-xs font-bold transition-colors ${
                          launchPeriod === i ? "text-[#FC0B0B]" : "text-gray-600 hover:text-gray-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {[
                    "Very aggressive timeline. High execution pressure — risk scores will be adjusted upward.",
                    "Tight deadline. Feasibility requires exceptional team execution to maintain.",
                    "Balanced timeline. Best baseline for most early-stage startups.",
                    "Comfortable runway. More time to iterate improves feasibility and innovation.",
                    "Long horizon. Allows deep product development but watch market window shifts.",
                  ][launchPeriod]}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <button
          onClick={handleAnalyze}
          disabled={!isReady}
          className="w-full bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] hover:from-[#FC0B0B] hover:to-[#FAA41A] disabled:opacity-30 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-[#FC0B0B]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-3"
        >
          <Rocket className="w-5 h-5" />
          Launch Analysis Engine
        </button>
        {!isReady && <p className="text-center text-xs text-gray-600">Describe your idea in at least 20 characters to unlock the engine.</p>}
      </div>
    </RadialGlowBackground>
  );
}

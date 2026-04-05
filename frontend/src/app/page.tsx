"use client";

import Link from "next/link";
import Image from "next/image";
import { Pen, Brain, BarChart3, Rocket, ArrowRight, AlertTriangle } from "lucide-react";
import { NavLogo } from "@/components/NavLogo";
import GradientBlinds from "@/components/ui/GradientBlinds";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-white overflow-hidden relative">
      <GradientBlinds 
        className="fixed inset-0 w-full h-full -z-20 opacity-30"
        gradientColors={["#000000", "#FC0B0B", "#FAA41A", "#e00a0a", "#000000"]}
        noise={0.3}
        spotlightSoftness={1}
      />
      {/* Background ambient glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#FC0B0B]/10 blur-[140px] -z-10 rounded-full" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#FAA41A]/8 blur-[140px] -z-10 rounded-full" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FC0B0B]/5 blur-[180px] -z-10 rounded-full" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <NavLogo />
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-gray-400 hover:text-white transition-colors font-medium px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth?mode=signup" className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FC0B0B]/30 bg-[#e00a0a]/10 text-[#fa3a3a] text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC0B0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e00a0a]"></span>
            </span>
            AI Engine v2.0 — 316 Startups Indexed
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter">
            Stop wasting months<br />
            on{" "}
            <span className="bg-gradient-to-r from-[#FC0B0B] via-[#f74f0f] to-[#FAA41A] bg-clip-text text-transparent">
              bad ideas
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Get AI-backed feasibility, risk, and success probability in seconds — grounded in real startup patterns, not hallucinations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth?mode=signup"
              className="bg-[#FC0B0B] hover:bg-[#e00a0a] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-[#FC0B0B]/30 flex items-center justify-center gap-2 group"
            >
              Analyze Your Idea
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <a
              href="#how"
              className="px-10 py-4 rounded-2xl border border-white/10 hover:bg-white/5 font-bold text-lg transition-all text-center"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof stats */}
          <div className="pt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto border-t border-white/5">
            {[
              { val: "3s", label: "GO/NO-GO Decision" },
              { val: "98%", label: "Analysis Accuracy" },
              { val: "316+", label: "Real Startups Indexed" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white">{s.val}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Demo Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] rounded-3xl blur opacity-20" />
            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden">
              {/* Fake window chrome */}
              <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">⚡ Live Analysis Preview</div>
                <div className="w-12" />
              </div>
              {/* Fake result card */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Idea Input</div>
                  <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 font-mono">
                    "An AI tool that helps founders validate startup ideas using real market data and historical patterns..."
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#e00a0a]/10 text-[#FC0B0B] rounded-full text-xs font-bold border border-[#FC0B0B]/20">B2B SaaS</span>
                    <span className="px-3 py-1 bg-[#FAA41A]/10 text-[#FAA41A] rounded-full text-xs font-bold border border-[#FAA41A]/20">Global</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Engine Output</div>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-black text-white">78</div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Overall Score</div>
                      <div className="px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm font-bold flex items-center gap-1.5 inline-block">
                        <AlertTriangle className="w-4 h-4 text-[#FAA41A]" /> Validate First
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Feasibility", score: 82, color: "bg-[#e00a0a]" },
                      { label: "Innovation", score: 74, color: "bg-[#FAA41A]" },
                      { label: "Risk", score: 61, color: "bg-red-500" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-3 text-sm">
                        <div className="w-20 text-gray-400 text-xs">{m.label}</div>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }} />
                        </div>
                        <div className="text-xs text-gray-400 w-8 text-right">{m.score}%</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 italic">Reason: High competition + unclear differentiation in target segment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="text-xs text-[#FC0B0B] uppercase tracking-widest font-bold">The Flow</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">From idea to decision<br />in under 10 seconds</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Input Your Idea", desc: "Describe your startup or upload a doc. Add filters like industry, stage, and revenue model.", Icon: Pen, color: "text-[#FC0B0B]", bg: "bg-[#e00a0a]/10" },
              { step: "02", title: "AI Analyzes", desc: "TF-IDF matcher finds real historical comps. LLM generates grounded feasibility reasoning.", Icon: Brain, color: "text-[#FAA41A]", bg: "bg-[#FAA41A]/10" },
              { step: "03", title: "Get Scores", desc: "Feasibility, Innovation, Risk — each with confidence intervals and 3–5 reasoning bullets.", Icon: BarChart3, color: "text-green-400", bg: "bg-green-500/10" },
              { step: "04", title: "Decide & Export", desc: "GO / VALIDATE / AVOID decision with export to PDF. Or enhance your idea with AI suggestions.", Icon: Rocket, color: "text-pink-400", bg: "bg-pink-500/10" },
            ].map((item) => (
              <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#FC0B0B]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-xs text-gray-600 font-mono font-black">{item.step}</span>
                </div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="px-6 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="text-xs text-[#FAA41A] uppercase tracking-widest font-bold">The Math</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Scores that actually<br />mean something</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#FC0B0B]/10 to-transparent border border-[#FC0B0B]/20 rounded-3xl p-8 space-y-4">
              <div className="text-5xl font-black text-[#FC0B0B]">82<span className="text-2xl text-gray-500">/100</span></div>
              <h3 className="text-xl font-bold">Feasibility</h3>
              <p className="text-gray-400 text-sm">Can this be built? We analyze technical constraints, regulatory hurdles, and execution difficulty based on historical failures.</p>
            </div>
            <div className="bg-gradient-to-b from-[#FAA41A]/10 to-transparent border border-[#FAA41A]/20 rounded-3xl p-8 space-y-4 relative md:-translate-y-4">
              <div className="text-5xl font-black text-[#FAA41A]">74<span className="text-2xl text-gray-500">/100</span></div>
              <h3 className="text-xl font-bold">Innovation</h3>
              <p className="text-gray-400 text-sm">How crowded is this space? We cross-reference against 30,000+ logged startups to see if you are a clone or a pioneer.</p>
            </div>
            <div className="bg-gradient-to-b from-gray-500/10 to-transparent border border-gray-500/20 rounded-3xl p-8 space-y-4">
              <div className="text-5xl font-black text-white">61<span className="text-2xl text-gray-500">/100</span></div>
              <h3 className="text-xl font-bold">Risk Profile</h3>
              <p className="text-gray-400 text-sm">What will kill you first? From founder conflict to cash burn, we identify the specific pitfalls your idea model faces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="px-6 py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-[#FC0B0B]/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <div className="text-xs text-white uppercase tracking-widest font-bold opacity-50">Context</div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tight">Learn from history</h2>
             <p className="text-gray-400 max-w-xl mx-auto">We don't guess. We match your idea against the post-mortems of startups that already tried it and failed.</p>
          </div>
          
          <div className="bg-black border border-white/10 rounded-3xl overflow-hidden max-w-4xl mx-auto shadow-2xl shadow-[#FC0B0B]/10">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Historical Match</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-300 line-through decoration-red-500/50">Quibi</h4>
                  <p className="text-sm text-gray-500 mt-1">Short-form video platform &bull; Failed 2020</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm border-b border-white/5 pb-3 flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">X</span> <span className="text-gray-300">Astronomical customer acquisition cost</span></div>
                  <div className="text-sm border-b border-white/5 pb-3 flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">X</span> <span className="text-gray-300">Misread user mobile behavior</span></div>
                  <div className="text-sm text-gray-500 italic pt-2">&ldquo;Gave away free trials but couldn't convert to paid amidst TikTok dominance.&rdquo;</div>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FAA41A]" />
                  <span className="text-xs font-bold text-[#FAA41A] uppercase tracking-wider">Your Deviation</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white">Your Streaming App</h4>
                  <p className="text-sm text-[#FAA41A] mt-1">User generated content via incentives &bull; Present</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm border-b border-white/5 pb-3 flex items-start gap-2"><span className="text-[#FAA41A] font-bold mt-0.5">&#10003;</span> <span className="text-gray-300">Zero content production costs</span></div>
                  <div className="text-sm border-b border-white/5 pb-3 flex items-start gap-2"><span className="text-[#FAA41A] font-bold mt-0.5">&#10003;</span> <span className="text-gray-300">Native social graph integration</span></div>
                  <div className="text-sm text-gray-400 italic pt-2">&ldquo;If you can crack the viral loop, unit economics are drastically better than Quibi.&rdquo;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">
            Ready to find out if<br />
            <span className="bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] bg-clip-text text-transparent">your idea survives?</span>
          </h2>
          <p className="text-gray-400 text-lg">No credit card. No friction. Just your idea and 10 seconds of your time.</p>
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] hover:from-[#FC0B0B] hover:to-[#FAA41A] text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-[#FC0B0B]/30 group"
          >
            Validate My Idea Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-8">
          <Image src="/uplift_footer_darkmode.png" alt="upLIFT" width={200} height={48} className="h-10 w-auto opacity-70" />
          
          <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-400">
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#compare" className="hover:text-white transition-colors">Comparison</a>
          </div>
        </div>
        
        <p className="text-xs text-gray-600">&copy; 2026 upLIFT AI Engine &mdash; Built for founders, by builders.</p>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavLogo } from "@/components/NavLogo";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Trash2 } from "lucide-react";
import { supabaseClient } from "@/utils/supabaseClient";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";
import { getApiBaseUrl } from "@/utils/api-client";

interface LaunchRecord {
  id: string;
  created_at: string;
  startup_name: string;
  decision: string;
  feasibility_score: number;
  innovation_score: number;
  risk_score: number;
}

export default function HistoryPage() {
  const { user, sessionToken } = useStore();
  const router = useRouter();
  const [launches, setLaunches] = useState<LaunchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    
    const fetchHistory = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const freshToken = session?.access_token || sessionToken;

        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/history`, {
          headers: {
            "Authorization": `Bearer ${freshToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLaunches(data);
        } else {
          console.error("Failed to fetch history:", await response.text());
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user, sessionToken, router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      const freshToken = session?.access_token || sessionToken;

      const response = await fetch(`http://localhost:3001/api/history/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${freshToken}`
        }
      });
      if (response.ok) {
        setLaunches((prev) => prev.filter((launch) => launch.id !== id));
      } else {
        console.error("Failed to delete history item:", await response.text());
      }
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

  if (!user) return null;

  return (
    <RadialGlowBackground darker className="text-white">
      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-[#FC0B0B]/8 blur-[120px] -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[300px] h-[300px] bg-[#FAA41A]/5 blur-[100px] -z-10 rounded-full" />
      
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <NavLogo />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#228B22] animate-pulse inline-block" />
            AI Engine Ready
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Clock className="w-5 h-5 text-gray-300" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Launch History</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-lg">Review your past startup AI analyses and evaluations.</p>
        </header>

        {loading ? (
          <div className="text-gray-500 text-center py-20 flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-[#FC0B0B] border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
            Loading historical data...
          </div>
        ) : launches.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-gray-400">No launches found. Head back to the dashboard to launch your first idea.</p>
            <Link href="/dashboard" className="mt-4 inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
              Launch Engine
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {launches.map((launch) => (
              <div key={launch.id} className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all group">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FAA41A] transition-colors line-clamp-1">{launch.startup_name}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(launch.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6 text-sm flex-wrap justify-between sm:justify-end">
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-gray-500 text-[10px] uppercase">Feasibility</span>
                    <span className="font-mono font-bold text-[#8BAE66]">{(launch.feasibility_score * 10).toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-gray-500 text-[10px] uppercase">Innovation</span>
                    <span className="font-mono font-bold text-[#A1D17A]">{(launch.innovation_score * 10).toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-gray-500 text-[10px] uppercase">Risk</span>
                    <span className="font-mono font-bold text-[#EBD5AB]">{(launch.risk_score * 10).toFixed(1)}</span>
                  </div>
                  
                  <div className="pl-4 border-l border-white/10 flex items-center gap-2">
                     {launch.decision === "BUILD" ? (
                       <div className="flex items-center gap-2 text-[#228B22] bg-[#228B22]/10 px-3 py-1.5 rounded-lg border border-[#228B22]/20">
                         <CheckCircle className="w-4 h-4" />
                         <span className="font-bold text-xs tracking-wider uppercase">{launch.decision}</span>
                       </div>
                     ) : launch.decision === "VALIDATE" ? (
                       <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                         <AlertTriangle className="w-4 h-4" />
                         <span className="font-bold text-xs tracking-wider uppercase">{launch.decision}</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 text-[#FC0B0B] bg-[#FC0B0B]/10 px-3 py-1.5 rounded-lg border border-[#FC0B0B]/20">
                         <XCircle className="w-4 h-4" />
                         <span className="font-bold text-xs tracking-wider uppercase">{launch.decision || "AVOID"}</span>
                       </div>
                     )}
                     <button
                        onClick={(e) => handleDelete(launch.id, e)}
                        className="ml-2 text-gray-500 hover:text-red-500 p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="Delete Analysis"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RadialGlowBackground>
  );
}

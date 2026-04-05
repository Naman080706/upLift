"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { supabaseClient } from "@/utils/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { RadialGlowBackground } from "@/components/ui/radial-glow-background";
import { getApiBaseUrl } from "@/utils/api-client";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, setSessionToken } = useStore();
  const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }

    // Handle incoming OAuth Redirect sessions from Supabase
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setSessionToken(session.access_token);
        setUser(session.user);
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [user, router, setSessionToken, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      
      if (data.session) {
        // Sync the Supabase client so getSession() always returns a fresh token
        await supabaseClient.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setSessionToken(data.session.access_token);
      }
      setUser(data.user);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <RadialGlowBackground className="relative flex h-screen min-h-screen text-white">
      <Link 
        href="/" 
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-all group font-bold tracking-tight"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden xs:inline">Back to Home</span>
        <span className="xs:hidden">Back</span>
      </Link>

      {/* Single unified layout — logo + form swap sides on mode change */}
      <motion.div
        layout
        className={`flex w-full h-full items-center justify-center transition-all ${
          mode === "signup" ? "flex-row-reverse" : "flex-row"
        }`}
      >

        {/* Logo side */}
        <motion.div
          layout
          key="logo-panel"
          initial={{ opacity: 0, x: mode === "signup" ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="hidden lg:flex w-1/2 h-full flex-col items-center justify-center px-16 gap-6"
        >
          <Link href="/" className="hover:scale-105 transition-transform duration-500">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Image
                src="/Logo1_Dark.png"
                alt="upLIFT Framework"
                width={320}
                height={640}
                className="w-auto h-[45vh] object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </Link>

          <motion.div
            layout
            className="text-center space-y-3"
          >
            <p className="text-gray-400 font-medium text-sm tracking-[0.3em] uppercase">
              The AI Validation Engine
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FC0B0B] animate-pulse" />
              <span className="text-xs text-gray-600 font-mono">316 startups indexed</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Form side — no background section, floats on the shared bg */}
        <motion.div
          layout
          key="form-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center px-4 md:px-16"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 sm:mb-10 text-center">
            <Link href="/">
              <Image src="/Logo2_Dark.png" alt="upLIFT" width={110} height={28} className="h-7 w-auto mx-auto" style={{ width: "auto" }} priority />
            </Link>
          </div>

          <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
            <div className="text-center space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {mode === "login" ? "Welcome back" : "Start validating"}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm px-4">
                {mode === "login" ? "Sign in to your account" : "Create your account in 10 seconds"}
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 backdrop-blur-sm shadow-2xl">
              {/* Toggle Switch */}
              <div className="flex bg-black/50 rounded-2xl p-1 border border-white/5">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                      mode === m ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" required={mode === "signup"} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FC0B0B]/60 transition-colors placeholder-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required={mode === "signup"} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FC0B0B]/60 transition-colors placeholder-gray-600" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@startup.com" required className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FC0B0B]/60 transition-colors placeholder-gray-600" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FC0B0B]/60 transition-colors placeholder-gray-600" />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#FC0B0B] to-[#FAA41A] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-[#FC0B0B]/20 transition-all mt-2">
                  {loading ? "Processing..." : mode === "login" ? "Sign In →" : "Create Account →"}
                </button>
              </form>

              <div className="relative flex items-center justify-center pt-2">
                <div className="absolute inset-0 flex items-center pt-2">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative px-4 bg-transparent text-xs text-gray-500 font-bold uppercase tracking-wider backdrop-blur-xl">
                  Or continue with
                </div>
              </div>

              <button type="button" onClick={handleGoogleAuth} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </RadialGlowBackground>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}

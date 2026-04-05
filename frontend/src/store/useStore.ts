import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalysisResult {
    overall_score: number;
    confidence_score: number;
    decision: string;
    idea?: string;
    summary?: { paragraph_1?: string; paragraph_2?: string };
    metrics: {
        feasibility: { score: number; reasoning: string[]; confidence?: number };
        innovation: { score: number; reasoning: string[]; confidence?: number };
        risk: { score: number; reasoning: string[]; confidence?: number };
    };
    comparison?: {
        similar_startups: any[];
        success_rate?: number;
        failure_patterns?: string[];
    };
    [key: string]: any;
}

interface AppState {
    user: any | null;
    sessionToken: string | null;
    idea: string;
    startupType: string;
    targetMarket: string;
    filters: Record<string, string>;
    analysisResult: AnalysisResult | null;
    enhancedResult: any | null;
    isAnalyzing: boolean;
    setUser: (user: any | null) => void;
    setSessionToken: (token: string | null) => void;
    setIdea: (idea: string) => void;
    setStartupType: (type: string) => void;
    setTargetMarket: (market: string) => void;
    setFilter: (key: string, value: string) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setEnhancedResult: (result: any | null) => void;
    setIsAnalyzing: (loading: boolean) => void;
    logout: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            sessionToken: null,
            idea: '',
            startupType: 'SaaS',
            targetMarket: 'Global',
            filters: {},
            analysisResult: null,
            enhancedResult: null,
            isAnalyzing: false,
            setUser: (user) => set({ user }),
            setSessionToken: (sessionToken) => set({ sessionToken }),
            setIdea: (idea) => set({ idea }),
            setStartupType: (startupType) => set({ startupType }),
            setTargetMarket: (targetMarket) => set({ targetMarket }),
            setFilter: (key, value) => set((state) => ({ 
                filters: { ...state.filters, [key]: value } 
            })),
            setAnalysisResult: (analysisResult) => set({ analysisResult }),
            setEnhancedResult: (enhancedResult) => set({ enhancedResult }),
            setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
            logout: () => set({ user: null, sessionToken: null, idea: '', analysisResult: null, enhancedResult: null })
        }),
        {
            name: 'uplift-store'
        }
    )
);

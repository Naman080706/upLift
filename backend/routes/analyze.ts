import { Router } from 'express';
import type { Request, Response } from 'express';
import { generateStartupReport } from '../utils/reportGenerator.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { supabase } from '../utils/supabaseClient.js';

const router = Router();
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

router.post('/analyze', requireAuth, async (req: Request, res: Response) => {
    try {
        const response = await fetch(`${AI_ENGINE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        
        if (!response.ok) {
            const error = await response.text();
            return res.status(response.status).json({ error });
        }
        
        const data = await response.json();
        
        // Save to Supabase History
        try {
            const user = (req as any).user;
            const idea = req.body.idea || "";
            // Generate a startup_name using first 5 words of idea
            const words = idea.split(' ').filter(Boolean);
            const startupName = words.slice(0, 5).join(' ') + (words.length > 5 ? "..." : "");
            
            await supabase.from('analyses').insert([{
                user_id: user.id,
                startup_name: startupName || "Untitled Startup",
                industry: req.body.filters?.industry || req.body.startup_type || "Unknown",
                target_market: req.body.target_market || "Global",
                problem_statement: idea.slice(0, 1000),
                solution: idea.slice(0, 1000),
                feasibility_score: data.metrics?.feasibility?.score || 0,
                innovation_score: data.metrics?.innovation?.score || 0,
                risk_score: data.metrics?.risk?.score || 0,
                success_rate: data.comparison?.success_rate || 0,
                decision: data.decision || "UNKNOWN"
            }]);
        } catch (dbError) {
            console.error("Failed to save to history", dbError);
        }
        
        res.json(data);
    } catch (error) {
        console.error('AI Engine Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI Engine' });
    }
});

router.post('/enhance', async (req: Request, res: Response) => {
    try {
        const response = await fetch(`${AI_ENGINE_URL}/enhance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Enhancement failed' });
    }
});

router.post('/report', (req: Request, res: Response) => {
    try {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=uplift-report.pdf');
        generateStartupReport(req.body, res);
    } catch (error) {
        res.status(500).json({ error: 'Report generation failed' });
    }
});

router.get('/history', requireAuth, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { data, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

router.delete('/history/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { id } = req.params;

        const { error } = await supabase
            .from('analyses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete history item' });
    }
});

export default router;

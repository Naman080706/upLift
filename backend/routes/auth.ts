import express, { type Request, type Response } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { supabase } from '../utils/supabaseClient.js';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Signup successful", user: data.user });
    } catch (e: any) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Login successful", user: data.user, session: data.session });
    } catch (e: any) {
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Endpoint to verify auth status and fetch user-specific backend profile.
 * Heavily relies on context added by `requireAuth` middleware.
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.status(200).json({
            message: "Authentication successful",
            user: user
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user context" });
    }
});

export default router;

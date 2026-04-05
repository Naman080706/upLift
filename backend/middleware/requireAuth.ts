import { type Request, type Response, type NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase API
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
    }

    // Attach user securely to request for downstream handlers
    (req as any).user = user;
    next();
    
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

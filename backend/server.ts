import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import analyzeRouter from './routes/analyze.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'upLIFT Gateway' });
});

app.use('/api', analyzeRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port} (Network Accessible)`);
});

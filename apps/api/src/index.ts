import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ratesRouter from './routes/rates';
import convertRouter from './routes/convert';
import watchlistRouter from './routes/watchlist';
import alertsRouter from './routes/alerts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/rates', ratesRouter);
app.use('/convert', convertRouter);
app.use('/watchlist', watchlistRouter);
app.use('/alerts', alertsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
import { Router, Request, Response } from 'express';
import { fetchAndStoreRates } from '../services/fx.service';
import pool from '../db';

const router = Router();

// POST /convert
router.post('/', async (req: Request, res: Response) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    res.status(400).json({ error: 'from, to and amount are required' });
    return;
  }

  try {
    const rates = await fetchAndStoreRates(from.toUpperCase()) as Record<string, number>;
    const rate = rates[to.toUpperCase()];

    if (!rate) {
      res.status(404).json({ error: `Rate not found for ${to}` });
      return;
    }

    const converted_amount = parseFloat((amount * rate).toFixed(2));

    // Save to history
    await pool.query(
      `INSERT INTO conversion_history
        (from_currency, to_currency, amount, rate_used, converted_amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [from.toUpperCase(), to.toUpperCase(), amount, rate, converted_amount]
    );

    res.json({ from, to, amount, rate, converted_amount });
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

export default router;
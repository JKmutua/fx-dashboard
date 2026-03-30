import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /watchlist
router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    'SELECT * FROM watchlist ORDER BY added_at DESC'
  );
  res.json(rows);
});

// POST /watchlist
router.post('/', async (req: Request, res: Response) => {
  const { base_currency, target_currency } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO watchlist (base_currency, target_currency)
       VALUES ($1, $2)
       ON CONFLICT (base_currency, target_currency) DO NOTHING
       RETURNING *`,
      [base_currency.toUpperCase(), target_currency.toUpperCase()]
    );
    res.json(rows[0] || { message: 'Already in watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// DELETE /watchlist/:id
router.delete('/:id', async (req: Request, res: Response) => {
  await pool.query('DELETE FROM watchlist WHERE id = $1', [req.params.id]);
  res.json({ message: 'Removed from watchlist' });
});

export default router;
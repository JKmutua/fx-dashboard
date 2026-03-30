import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /alerts
router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    'SELECT * FROM rate_alerts ORDER BY created_at DESC'
  );
  res.json(rows);
});

// POST /alerts
router.post('/', async (req: Request, res: Response) => {
  const { base_currency, target_currency, target_rate, direction } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO rate_alerts
        (base_currency, target_currency, target_rate, direction)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [base_currency.toUpperCase(), target_currency.toUpperCase(), target_rate, direction]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// DELETE /alerts/:id
router.delete('/:id', async (req: Request, res: Response) => {
  await pool.query('DELETE FROM rate_alerts WHERE id = $1', [req.params.id]);
  res.json({ message: 'Alert deleted' });
});

export default router;
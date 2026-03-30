import { Router, Request, Response } from 'express';
import { fetchAndStoreRates, getHistoricalRates } from '../services/fx.service';

const router = Router();

// GET /rates/:base — latest rates
router.get('/:base', async (req: Request, res: Response) => {
  try {
    const base = String(req.params.base).toUpperCase();
    const rates = await fetchAndStoreRates(base);
    res.json({ base, rates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

// GET /rates/:base/:target/history
router.get('/:base/:target/history', async (req: Request, res: Response) => {
  try {
    const base = String(req.params.base).toUpperCase();
    const target = String(req.params.target).toUpperCase();
    const days = parseInt(req.query.days as string) || 30;
    const history = await getHistoricalRates(base, target, days);
    res.json({ base, target, history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
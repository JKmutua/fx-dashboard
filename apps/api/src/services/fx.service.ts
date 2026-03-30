import axios from 'axios';
import NodeCache from 'node-cache';
import pool from '../db';

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const BASE_URL = process.env.FRANKFURTER_API || 'https://api.frankfurter.app';

export const fetchAndStoreRates = async (base: string = 'USD') => {
  const cacheKey = `rates_${base}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(`${BASE_URL}/latest?from=${base}`);

  // Store each rate in the database
  const entries = Object.entries(data.rates) as [string, number][];
  for (const [target, rate] of entries) {
    try {
      await pool.query(
        `INSERT INTO fx_rates (base_currency, target_currency, rate)
         VALUES ($1, $2, $3)`,
        [base, target, rate]
      );
    } catch (err) {
      // Log but don't crash — skip currencies not in our currencies table
      console.warn(`⚠️ Skipping ${base}→${target}: not in currencies table`);
    }
  }

  cache.set(cacheKey, data.rates);
  return data.rates;
};

export const getHistoricalRates = async (
  base: string,
  target: string,
  days: number = 30
) => {
  const { rows } = await pool.query(
    `SELECT rate, fetched_at
     FROM fx_rates
     WHERE base_currency = $1
       AND target_currency = $2
     ORDER BY fetched_at DESC
     LIMIT $3`,
    [base, target, days]
  );
  return rows;
};
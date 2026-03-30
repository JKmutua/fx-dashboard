'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface WatchlistItem { id: string; base_currency: string; target_currency: string; added_at: string; }
const CURRENCIES = ['USD','EUR','GBP','KES','JPY','CAD','AUD','ZAR','NGN','INR','CHF','SGD'];

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('KES');
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    const { data } = await api.get('/watchlist');
    setItems(data);
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const addToWatchlist = async () => {
    setLoading(true);
    try {
      await api.post('/watchlist', { base_currency: base, target_currency: target });
      await fetchWatchlist();
    } finally { setLoading(false); }
  };

  const remove = async (id: string) => {
    await api.delete(`/watchlist/${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const selectStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Watchlist</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track your favourite currency pairs</p>
      </div>

      {/* Add pair */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={base} onChange={e => setBase(e.target.value)} style={selectStyle}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
        <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={addToWatchlist} disabled={loading} style={{
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}>
          + Add Pair
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
          No pairs in watchlist yet
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'border-color 0.2s',
            }}
            // onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
            // onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.base_currency}
                  <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>/</span>
                  {item.target_currency}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                  Added {new Date(item.added_at).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => remove(item.id)} style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; e.currentTarget.style.color = 'var(--accent-red)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
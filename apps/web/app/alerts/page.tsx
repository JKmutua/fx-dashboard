'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Alert { id: string; base_currency: string; target_currency: string; target_rate: number; direction: 'above' | 'below'; is_active: boolean; created_at: string; }
const CURRENCIES = ['USD','EUR','GBP','KES','JPY','CAD','AUD','ZAR','NGN','INR','CHF','SGD'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('KES');
  const [targetRate, setTargetRate] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    const { data } = await api.get('/alerts');
    setAlerts(data);
  };

  useEffect(() => { fetchAlerts(); }, []);

  const createAlert = async () => {
    if (!targetRate) return;
    setLoading(true);
    try {
      await api.post('/alerts', { base_currency: base, target_currency: target, target_rate: parseFloat(targetRate), direction });
      await fetchAlerts();
      setTargetRate('');
    } finally { setLoading(false); }
  };

  const deleteAlert = async (id: string) => {
    await api.delete(`/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a.id !== id));
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Rate Alerts</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Get notified when a rate crosses your target</p>
      </div>

      {/* Create alert */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>New Alert</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={base} onChange={e => setBase(e.target.value)} style={selectStyle}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>/</span>
          <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={direction} onChange={e => setDirection(e.target.value as 'above' | 'below')} style={selectStyle}>
            <option value="above">goes above</option>
            <option value="below">goes below</option>
          </select>

          <input
            type="number"
            placeholder="Target rate"
            value={targetRate}
            onChange={e => setTargetRate(e.target.value)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              outline: 'none',
              width: '140px',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />

          <button onClick={createAlert} disabled={loading} style={{
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
            + Set Alert
          </button>
        </div>
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
          No alerts set yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{
                  background: alert.direction === 'above' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${alert.direction === 'above' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: alert.direction === 'above' ? 'var(--accent-green)' : 'var(--accent-red)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>{alert.direction === 'above' ? '↑ ABOVE' : '↓ BELOW'}</span>

                <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {alert.base_currency}/{alert.target_currency}
                </p>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  target: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{alert.target_rate}</span>
                </p>
              </div>

              <button onClick={() => deleteAlert(alert.id)} style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 14px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s',
              }}
            //   onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; e.currentTarget.style.color = 'var(--accent-red)'; }}
            //   onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import api from '@/lib/api';

const CURRENCIES = ['USD','EUR','GBP','KES','JPY','CAD','AUD','ZAR','NGN','INR','CHF','SGD'];

export default function ConvertPage() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KES');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<{ rate: number; converted_amount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) { setError('Enter a valid amount'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await api.post('/convert', { from, to, amount: parseFloat(amount) });
      setResult(data);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  const selectStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '1rem',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Currency Converter
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Live rates powered by Frankfurter API
        </p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>

        {/* Amount input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Amount</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.5rem',
              fontWeight: 600,
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* From / Swap / To */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button onClick={swap} style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >⇄</button>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>To</label>
            <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Convert button */}
        <button onClick={handleConvert} disabled={loading} style={{
          width: '100%',
          background: loading ? 'var(--bg-elevated)' : 'var(--accent)',
          border: 'none',
          borderRadius: '12px',
          padding: '14px',
          color: loading ? 'var(--text-muted)' : '#fff',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          letterSpacing: '0.02em',
        }}>
          {loading ? 'Converting...' : 'Convert'}
        </button>

        {/* Error */}
        {error && (
          <p style={{ marginTop: '1rem', color: 'var(--accent-red)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>
        )}

        {/* Result */}
        {result && (
          <div style={{
            marginTop: '1.5rem',
            background: 'var(--bg-elevated)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '14px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              {amount} {from} =
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--accent)',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}>
              {result.converted_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span style={{ fontSize: '1.2rem', marginLeft: '8px', color: 'var(--text-secondary)' }}>{to}</span>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              1 {from} = {result.rate.toFixed(4)} {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
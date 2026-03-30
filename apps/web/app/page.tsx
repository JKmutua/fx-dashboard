'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Rate { currency: string; rate: number; }

const CURRENCY_NAMES: Record<string, string> = {
  AUD: 'Australian Dollar', BRL: 'Brazilian Real', CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc', CNY: 'Chinese Yuan', CZK: 'Czech Koruna',
  DKK: 'Danish Krone', EUR: 'Euro', GBP: 'British Pound',
  HKD: 'Hong Kong Dollar', HUF: 'Hungarian Forint', IDR: 'Indonesian Rupiah',
  ILS: 'Israeli Shekel', INR: 'Indian Rupee', ISK: 'Icelandic Króna',
  JPY: 'Japanese Yen', KES: 'Kenyan Shilling', KRW: 'South Korean Won',
  MXN: 'Mexican Peso', MYR: 'Malaysian Ringgit', NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar', PHP: 'Philippine Peso', PLN: 'Polish Złoty',
  RON: 'Romanian Leu', SEK: 'Swedish Krona', SGD: 'Singapore Dollar',
  THB: 'Thai Baht', TRY: 'Turkish Lira', ZAR: 'South African Rand',
};

const BASE_OPTIONS = ['USD', 'EUR', 'GBP', 'KES', 'JPY', 'CAD', 'AUD'];

export default function HomePage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [base, setBase] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [search, setSearch] = useState('');

  const fetchRates = async (baseCurrency: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/rates/${baseCurrency}`);
      const formatted = Object.entries(data.rates as Record<string, number>)
        .map(([currency, rate]) => ({ currency, rate }));
      setRates(formatted);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(base);
    const interval = setInterval(() => fetchRates(base), 60000);
    return () => clearInterval(interval);
  }, [base]);

  const filtered = rates.filter(r =>
    r.currency.toLowerCase().includes(search.toLowerCase()) ||
    (CURRENCY_NAMES[r.currency] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}>Live Exchange Rates</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
              {lastUpdated ? `Updated ${lastUpdated} · auto-refresh 60s` : 'Fetching rates...'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {BASE_OPTIONS.map(c => (
              <button key={c} onClick={() => setBase(c)} style={{
                background: base === c ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${base === c ? 'var(--accent)' : 'var(--border)'}`,
                color: base === c ? '#fff' : 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '2rem',
      }}>
        {[
          { label: 'Pairs Tracked', value: rates.length },
          { label: 'Base Currency', value: base },
          { label: 'Data Source', value: 'Frankfurter' },
          { label: 'Refresh Rate', value: '60s' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <span style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', fontSize: '14px',
        }}>⌕</span>
        <input
          type="text"
          placeholder="Search by currency code or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '12px 14px 12px 36px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
          fetching rates...
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Currency', 'Name', `Rate (1 ${base})`].map((h, i) => (
                  <th key={h} style={{
                    padding: '14px 20px',
                    textAlign: i === 2 ? 'right' : 'left',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    background: 'var(--bg-elevated)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ currency, rate }, i) => (
                <tr key={currency} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                // onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                // onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: 'var(--accent-glow)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      color: 'var(--accent)',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                    }}>{currency}</span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {CURRENCY_NAMES[currency] || currency}
                  </td>
                  <td style={{
                    padding: '16px 20px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}>
                    {rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
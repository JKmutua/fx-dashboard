-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Currencies
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(3) UNIQUE NOT NULL,       -- e.g. USD, KES, EUR
  name VARCHAR(100) NOT NULL,            -- e.g. US Dollar
  symbol VARCHAR(10) NOT NULL,           -- e.g. $
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FX Rates (time-series)
CREATE TABLE fx_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  rate NUMERIC(18, 6) NOT NULL,
  source VARCHAR(50) DEFAULT 'frankfurter',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (base_currency) REFERENCES currencies(code),
  FOREIGN KEY (target_currency) REFERENCES currencies(code)
);

-- Indexes for fast time-series queries
CREATE INDEX idx_fx_rates_pair ON fx_rates(base_currency, target_currency);
CREATE INDEX idx_fx_rates_fetched ON fx_rates(fetched_at DESC);

-- Conversion History
CREATE TABLE conversion_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  amount NUMERIC(18, 2) NOT NULL,
  rate_used NUMERIC(18, 6) NOT NULL,
  converted_amount NUMERIC(18, 2) NOT NULL,
  converted_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (from_currency) REFERENCES currencies(code),
  FOREIGN KEY (to_currency) REFERENCES currencies(code)
);

-- Watchlist (currency pairs to track)
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(base_currency, target_currency),
  FOREIGN KEY (base_currency) REFERENCES currencies(code),
  FOREIGN KEY (target_currency) REFERENCES currencies(code)
);

-- Rate Alerts
CREATE TABLE rate_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_currency VARCHAR(3) NOT NULL,
  target_currency VARCHAR(3) NOT NULL,
  target_rate NUMERIC(18, 6) NOT NULL,
  direction VARCHAR(5) CHECK (direction IN ('above', 'below')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (base_currency) REFERENCES currencies(code),
  FOREIGN KEY (target_currency) REFERENCES currencies(code)
);

-- Seed currencies
INSERT INTO currencies (code, name, symbol) VALUES
  ('USD', 'US Dollar', '$'),
  ('EUR', 'Euro', '€'),
  ('GBP', 'British Pound', '£'),
  ('KES', 'Kenyan Shilling', 'KSh'),
  ('UGX', 'Ugandan Shilling', 'USh'),
  ('TZS', 'Tanzanian Shilling', 'TSh'),
  ('NGN', 'Nigerian Naira', '₦'),
  ('GHS', 'Ghanaian Cedi', '₵'),
  ('ZAR', 'South African Rand', 'R'),
  ('JPY', 'Japanese Yen', '¥'),
  ('CAD', 'Canadian Dollar', 'CA$'),
  ('AUD', 'Australian Dollar', 'A$');
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
}

export interface FxRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  fetched_at: string;
}

export interface ConversionResult {
  from_currency: string;
  to_currency: string;
  amount: number;
  rate_used: number;
  converted_amount: number;
}

export interface RateAlert {
  id: string;
  base_currency: string;
  target_currency: string;
  target_rate: number;
  direction: 'above' | 'below';
  is_active: boolean;
  triggered_at: string | null;
}

export interface WatchlistItem {
  id: string;
  base_currency: string;
  target_currency: string;
  added_at: string;
}
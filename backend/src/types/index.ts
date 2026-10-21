export type Decimal = string;
export type Market = 'B3' | 'US';
export type Currency = 'BRL' | 'USD';

export interface Asset {
  id: number;
  ticker: string;
  name: string;
  market: Market;
  currency: Currency;
  sector: string | null;
  active: boolean;
  created_at: string;
}

export interface DailyPrice {
  asset_id: number;
  price_date: string;
  open: Decimal;
  high: Decimal;
  low: Decimal;
  close: Decimal;
  adjusted_close: Decimal | null;
  volume: string;
  source: string;
}

export interface Fundamentals {
  id: number;
  asset_id: number;
  period_end: string;
  earnings_per_share: Decimal | null;
  book_value_per_share: Decimal | null;
  revenue: Decimal | null;
  net_income: Decimal | null;
  roe: Decimal | null;
  dividend_yield: Decimal | null;
  debt_to_equity: Decimal | null;
  source: string;
  collected_at: string;
}

export interface Analysis {
  id: number;
  asset_id: number;
  price_date: string;
  fundamentals_id: number;
  model: string;
  model_version: string;
  fair_value: Decimal | null;
  margin_of_safety: Decimal | null;
  score: Decimal | null;
  summary: string | null;
  created_at: string;
}

export interface DailyReport {
  id: number;
  report_date: string;
  market: Market;
  summary: string | null;
  created_at: string;
}

export interface DailyReportItem {
  report_id: number;
  analysis_id: number;
  position: number;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  services: Record<'postgres' | 'redis', 'up' | 'down'>;
}

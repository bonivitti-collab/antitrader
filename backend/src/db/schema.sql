BEGIN;

CREATE TABLE assets (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticker TEXT NOT NULL CHECK (length(trim(ticker)) > 0 AND ticker = upper(ticker)),
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    market TEXT NOT NULL CHECK (market IN ('B3', 'US')),
    currency TEXT NOT NULL CHECK (currency IN ('BRL', 'USD')),
    sector TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ticker, market)
);

CREATE TABLE daily_prices (
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    price_date DATE NOT NULL,
    open NUMERIC(20, 6) NOT NULL CHECK (open > 0),
    high NUMERIC(20, 6) NOT NULL CHECK (high > 0),
    low NUMERIC(20, 6) NOT NULL CHECK (low > 0),
    close NUMERIC(20, 6) NOT NULL CHECK (close > 0),
    adjusted_close NUMERIC(20, 6) CHECK (adjusted_close > 0),
    volume BIGINT NOT NULL CHECK (volume >= 0),
    source TEXT NOT NULL CHECK (length(trim(source)) > 0),
    PRIMARY KEY (asset_id, price_date),
    CHECK (low <= open AND low <= close AND high >= open AND high >= close AND low <= high)
);

CREATE TABLE fundamentals (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    period_end DATE NOT NULL,
    earnings_per_share NUMERIC(20, 6),
    book_value_per_share NUMERIC(20, 6),
    revenue NUMERIC(24, 2),
    net_income NUMERIC(24, 2),
    roe NUMERIC(12, 6),
    dividend_yield NUMERIC(12, 6) CHECK (dividend_yield >= 0),
    debt_to_equity NUMERIC(20, 6),
    source TEXT NOT NULL CHECK (length(trim(source)) > 0),
    collected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (asset_id, period_end, source),
    UNIQUE (id, asset_id)
);

CREATE TABLE analyses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    price_date DATE NOT NULL,
    fundamentals_id INTEGER NOT NULL,
    model TEXT NOT NULL CHECK (length(trim(model)) > 0),
    model_version TEXT NOT NULL CHECK (length(trim(model_version)) > 0),
    fair_value NUMERIC(20, 6) CHECK (fair_value > 0),
    margin_of_safety NUMERIC(12, 6) CHECK (margin_of_safety <= 1),
    score NUMERIC(7, 4) CHECK (score BETWEEN 0 AND 100),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id, price_date) REFERENCES daily_prices(asset_id, price_date),
    FOREIGN KEY (fundamentals_id, asset_id) REFERENCES fundamentals(id, asset_id),
    UNIQUE (asset_id, price_date, fundamentals_id, model, model_version)
);

CREATE TABLE daily_reports (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_date DATE NOT NULL,
    market TEXT NOT NULL CHECK (market IN ('B3', 'US')),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (report_date, market)
);

CREATE TABLE daily_report_items (
    report_id INTEGER NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
    analysis_id INTEGER NOT NULL REFERENCES analyses(id),
    position INTEGER NOT NULL CHECK (position > 0),
    PRIMARY KEY (report_id, analysis_id),
    UNIQUE (report_id, position)
);

CREATE INDEX daily_prices_date_idx ON daily_prices (price_date DESC);
CREATE INDEX analyses_fundamentals_idx ON analyses (fundamentals_id, asset_id);
CREATE INDEX analyses_ranking_idx ON analyses (price_date DESC, score DESC NULLS LAST);
CREATE INDEX daily_report_items_analysis_idx ON daily_report_items (analysis_id);

COMMIT;

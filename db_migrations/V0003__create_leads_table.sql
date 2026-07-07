CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    lead_type VARCHAR(20) NOT NULL,
    data JSONB NOT NULL,
    telegram_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
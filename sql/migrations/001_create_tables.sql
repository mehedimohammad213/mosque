-- Mosque management schema
-- PostgreSQL + plain SQL

-- Enums
CREATE TYPE mosque_status AS ENUM ('pending', 'verified', 'rejected', 'inactive');
CREATE TYPE user_role AS ENUM ('admin', 'mosque_admin');
CREATE TYPE collection_status AS ENUM ('draft', 'published');
CREATE TYPE fund_request_status AS ENUM (
  'draft',
  'pending',
  'approved',
  'completed',
  'rejected',
  'cancelled'
);
CREATE TYPE payment_account_type AS ENUM ('bank', 'bkash', 'nagad', 'rocket', 'other');

-- Mosques
CREATE TABLE mosques (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  name_bn         VARCHAR(255),
  address         TEXT,
  division        VARCHAR(100) NOT NULL,
  district        VARCHAR(100) NOT NULL,
  upazila         VARCHAR(100),
  area            VARCHAR(100),
  phone           VARCHAR(50),
  email           VARCHAR(255),
  latitude        DECIMAL(10, 8),
  longitude       DECIMAL(11, 8),
  mosque_image    VARCHAR(500),
  status          mosque_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mosques_status ON mosques (status);
CREATE INDEX idx_mosques_division_district ON mosques (division, district);

-- Users
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  mosque_id       INTEGER REFERENCES mosques (id) ON DELETE SET NULL,
  name            VARCHAR(255) NOT NULL,
  phone           VARCHAR(50) NOT NULL,
  email           VARCHAR(255),
  password        VARCHAR(255) NOT NULL,
  role            user_role NOT NULL DEFAULT 'mosque_admin',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_phone_unique UNIQUE (phone)
);

CREATE INDEX idx_users_mosque_id ON users (mosque_id);
CREATE INDEX idx_users_role ON users (role);

-- Weekly collections
CREATE TABLE weekly_collections (
  id                SERIAL PRIMARY KEY,
  mosque_id         INTEGER NOT NULL REFERENCES mosques (id) ON DELETE CASCADE,
  week_start_date   DATE NOT NULL,
  week_end_date     DATE NOT NULL,
  amount            DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
  note              TEXT,
  status            collection_status NOT NULL DEFAULT 'draft',
  submitted_by      INTEGER REFERENCES users (id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT weekly_collections_dates_check CHECK (week_end_date >= week_start_date)
);

CREATE INDEX idx_weekly_collections_mosque_id ON weekly_collections (mosque_id);
CREATE INDEX idx_weekly_collections_week ON weekly_collections (week_start_date, week_end_date);
CREATE INDEX idx_weekly_collections_status ON weekly_collections (status);

-- Fund requests
CREATE TABLE fund_requests (
  id                SERIAL PRIMARY KEY,
  mosque_id         INTEGER NOT NULL REFERENCES mosques (id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  description       TEXT NOT NULL,
  fund_year         SMALLINT NOT NULL CHECK (fund_year >= 2000 AND fund_year <= 2100),
  required_amount   DECIMAL(12, 2) NOT NULL CHECK (required_amount > 0),
  start_date        DATE,
  needed_by         DATE,
  contact_person    VARCHAR(255),
  contact_phone     VARCHAR(50),
  status            fund_request_status NOT NULL DEFAULT 'draft',
  created_by        INTEGER REFERENCES users (id) ON DELETE SET NULL,
  approved_by       INTEGER REFERENCES users (id) ON DELETE SET NULL,
  approved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fund_requests_mosque_id ON fund_requests (mosque_id);
CREATE INDEX idx_fund_requests_status ON fund_requests (status);
CREATE INDEX idx_fund_requests_fund_year ON fund_requests (fund_year);

-- Mosque payment accounts
CREATE TABLE mosque_payment_accounts (
  id                SERIAL PRIMARY KEY,
  mosque_id         INTEGER NOT NULL REFERENCES mosques (id) ON DELETE CASCADE,
  account_type      payment_account_type NOT NULL,
  account_name      VARCHAR(255),
  account_number    VARCHAR(100) NOT NULL,
  bank_name         VARCHAR(255),
  branch_name       VARCHAR(255),
  routing_number    VARCHAR(50),
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mosque_payment_accounts_mosque_id ON mosque_payment_accounts (mosque_id);
CREATE INDEX idx_mosque_payment_accounts_type ON mosque_payment_accounts (account_type);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mosques_updated_at
  BEFORE UPDATE ON mosques
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_weekly_collections_updated_at
  BEFORE UPDATE ON weekly_collections
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_fund_requests_updated_at
  BEFORE UPDATE ON fund_requests
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_mosque_payment_accounts_updated_at
  BEFORE UPDATE ON mosque_payment_accounts
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

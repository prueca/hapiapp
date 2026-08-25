CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
  id          varchar(26) PRIMARY KEY,
  first_name  varchar(100),
  middle_name varchar(100),
  last_name   varchar(100),
  address     text,
  phone_no    varchar(32),
  role        varchar(50) NOT NULL
              CHECK (role IN ('distributor-admin','distributor-user','dealer-admin','dealer-user','franchisee-admin','franchisee-user')),
  username    varchar(100) NOT NULL UNIQUE,
  password    varchar(64) NOT NULL,
  account_id  varchar(26) NOT NULL REFERENCES account(id),
  status      varchar(20) NOT NULL DEFAULT 'active',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_account_id ON "user" (account_id);

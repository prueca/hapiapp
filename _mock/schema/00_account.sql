DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE account (
  id            varchar(26) PRIMARY KEY,
  name          varchar(255) NOT NULL,
  address       text,
  phone         varchar(32),
  isr_code      varchar(20),
  sap_code      varchar(20),
  company_code  varchar(20),
  type  varchar(20) NOT NULL
                 CHECK (type IN ('dealer','distributor','franchisee')),
  status        varchar(20) NOT NULL DEFAULT 'active',
  associate_id  varchar(26) REFERENCES account(id) DEFERRABLE INITIALLY DEFERRED,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

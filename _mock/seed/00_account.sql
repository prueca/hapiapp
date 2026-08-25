CREATE TEMP TABLE account_raw (
  id text, name text, address text, phone text,
  isr_code text, sap_code text, company_code text,
  account_type text, status text, associate_id text,
  created_at text, updated_at text
);
\copy account_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/account.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO account (id, name, address, phone, isr_code, sap_code,
                     company_code, account_type, status, associate_id)
SELECT
  TRIM(id),
  TRIM(name),
  TRIM(address),
  TRIM(phone),
  TRIM(isr_code),
  TRIM(sap_code),
  TRIM(company_code),
  TRIM(account_type),
  COALESCE(NULLIF(TRIM(status), ''), 'active'),
  NULLIF(TRIM(associate_id), '')
FROM account_raw;

DROP TABLE account_raw;

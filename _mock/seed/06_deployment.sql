CREATE TEMP TABLE deployment_raw (
  id text, status text, freezer_id text, account_id text, user_id text,
  created_at text, updated_at text, origin text, destination text
);
\copy deployment_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/deployment.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO deployment
    (id, status, freezer_id, account_id, user_id, origin, destination)
SELECT
  TRIM(id),
  TRIM(status),
  TRIM(freezer_id),
  TRIM(account_id),
  TRIM(user_id),
  NULLIF(TRIM(origin), ''),
  NULLIF(TRIM(destination), '')
FROM deployment_raw;

DROP TABLE deployment_raw;

CREATE TEMP TABLE cabcon_raw (
  id text, status text, account_id text, user_id text, image text,
  created_at text, updated_at text, freezer_id text
);
\copy cabcon_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/cabcon.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO cabcon
      (id, status, freezer_id, account_id, user_id, image)
SELECT
  TRIM(r.id),
  TRIM(r.status),
  TRIM(r.freezer_id),
  TRIM(r.account_id),
  TRIM(r.user_id),
  CASE WHEN TRIM(r.image) <> '' THEN TRIM(r.image) ELSE NULL END
FROM cabcon_raw r
JOIN freezer f ON f.id = TRIM(r.freezer_id);

DROP TABLE cabcon_raw;

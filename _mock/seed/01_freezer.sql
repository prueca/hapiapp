CREATE TEMP TABLE freezer_raw (
  id text, model text, capacity text, barcode text, brand text, year_model text,
  created_at text, updated_at text
);
\copy freezer_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/freezer.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO freezer (id, model, capacity, barcode, brand, year_model)
SELECT
  TRIM(id),
  TRIM(model),
  TRIM(capacity),
  TRIM(barcode),
  TRIM(brand),
  CASE WHEN TRIM(year_model) ~ '^[0-9]+$' THEN TRIM(year_model)::integer ELSE NULL END
FROM freezer_raw;

DROP TABLE freezer_raw;

CREATE TEMP TABLE product_raw (
  id text, name text, description text, category text, price text, currency text,
  size_value text, size_unit text, packaging text,
  created_at text, updated_at text
);
\copy product_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/product.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO product (id, name, description, category, price, currency, size_value, size_unit, packaging)
SELECT
  TRIM(id),
  TRIM(name),
  TRIM(description),
  TRIM(category),
  TRIM(price)::numeric(10,2),
  TRIM(currency),
  TRIM(size_value),
  TRIM(size_unit),
  TRIM(packaging)
FROM product_raw;

DROP TABLE product_raw;

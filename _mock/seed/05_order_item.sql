CREATE TEMP TABLE order_item_raw (
  id text, order_id text, product_id text, quantity text,
  unit_price text, total_price text, status text,
  created_at text, updated_at text
);
\copy order_item_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/order_item.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO order_item (order_id, product_id, quantity, unit_price, total_price, status)
SELECT
  TRIM(r.order_id),
  TRIM(r.product_id),
  TRIM(r.quantity)::integer,
  TRIM(r.unit_price)::numeric(10,2),
  TRIM(r.total_price)::numeric(12,2),
  o.status
FROM order_item_raw r
JOIN "order" o ON o.id = TRIM(r.order_id);

DROP TABLE order_item_raw;

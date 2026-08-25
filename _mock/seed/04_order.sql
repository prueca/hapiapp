CREATE TEMP TABLE order_raw (
  id text, user_id text, account_id text, order_date text,
  expected_delivery_date text, received_delivery_date text,
  updated_by text, status text, total_price text,
  created_at text, updated_at text
);
\copy order_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/order.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO "order" (id, user_id, account_id, order_date,
                     expected_delivery_date, received_delivery_date,
                     updated_by, status, total_price)
SELECT
  TRIM(id),
  TRIM(user_id),
  TRIM(account_id),
  TRIM(order_date)::date,
  CASE WHEN TRIM(expected_delivery_date) <> '' THEN TRIM(expected_delivery_date)::date ELSE NULL END,
  CASE WHEN TRIM(received_delivery_date) <> '' THEN TRIM(received_delivery_date)::date ELSE NULL END,
  TRIM(updated_by),
  TRIM(status),
  TRIM(total_price)::numeric(12,2)
FROM order_raw;

DROP TABLE order_raw;

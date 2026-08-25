DROP TABLE IF EXISTS "order" CASCADE;

CREATE TABLE "order" (
  id                     varchar(26) PRIMARY KEY,
  user_id                varchar(26) NOT NULL REFERENCES "user"(id),
  account_id             varchar(26) NOT NULL REFERENCES account(id),
  order_date             date NOT NULL,
  expected_delivery_date date,
  received_delivery_date date,
  updated_by             varchar(26),
  status                 varchar(20) NOT NULL
                          CHECK (status IN ('pending','confirmed','processing','delivered','cancelled')),
  total_price            numeric(12,2) NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_user_id    ON "order" (user_id);
CREATE INDEX idx_order_account_id ON "order" (account_id);
CREATE INDEX idx_order_status     ON "order" (status);

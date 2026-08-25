DROP TABLE IF EXISTS order_item CASCADE;

CREATE TABLE order_item (
  id          bigserial PRIMARY KEY,
  order_id    varchar(26) NOT NULL REFERENCES "order"(id),
  product_id  varchar(26) NOT NULL REFERENCES product(id),
  quantity    integer NOT NULL CHECK (quantity > 0),
  unit_price  numeric(10,2) NOT NULL,
  total_price numeric(12,2) NOT NULL,
  status      varchar(20) NOT NULL
                CHECK (status IN ('pending','confirmed','processing','delivered','cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_item_order_id   ON order_item (order_id);
CREATE INDEX idx_order_item_product_id ON order_item (product_id);
CREATE INDEX idx_order_item_status     ON order_item (status);

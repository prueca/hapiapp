DROP TABLE IF EXISTS freezer CASCADE;

CREATE TABLE freezer (
  id          varchar(26) PRIMARY KEY,
  model       varchar(100) NOT NULL,
  capacity    varchar(20),
  barcode     varchar(40),
  brand       varchar(50),
  year_model  integer,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_freezer_brand ON freezer (brand);
CREATE INDEX idx_freezer_model ON freezer (model);

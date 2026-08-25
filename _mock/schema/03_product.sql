DROP TABLE IF EXISTS product CASCADE;

CREATE TABLE product (
  id          varchar(26) PRIMARY KEY,
  name        varchar(100) NOT NULL,
  description varchar(255),
  category    varchar(50)
              CHECK (category IN ('Combination Packs','Limited Edition','Multi-Serve Tubs',
                                  'Premium Novelties','Single-Serve Novelties','Specialty Tubs')),
  price       numeric(10,2) NOT NULL,
  currency    varchar(3) NOT NULL,
  size_value  varchar(20),
  size_unit   varchar(20),
  packaging   varchar(30)
               CHECK (packaging IN ('Box','Cone','Cup','Gallon','Pint','Stick','Tub')),
  status      smallint NOT NULL DEFAULT 1
               CHECK (status IN (0,1)),
  enlisted    smallint NOT NULL DEFAULT 1
               CHECK (enlisted IN (0,1)),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_category ON product (category);

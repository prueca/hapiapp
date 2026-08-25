DROP TABLE IF EXISTS cabcon CASCADE;

CREATE TABLE cabcon (
  id              varchar(26) PRIMARY KEY,
  status          varchar(20) NOT NULL
                   CHECK (status IN ('manual submit','matched','mismatch')),
  freezer_id      varchar(26) NOT NULL REFERENCES freezer(id),
  account_id      varchar(26) NOT NULL REFERENCES account(id),
  user_id         varchar(26) NOT NULL REFERENCES "user"(id),
  image           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cabcon_status     ON cabcon (status);
CREATE INDEX idx_cabcon_freezer_id ON cabcon (freezer_id);
CREATE INDEX idx_cabcon_account_id ON cabcon (account_id);
CREATE INDEX idx_cabcon_user_id    ON cabcon (user_id);

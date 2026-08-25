DROP TABLE IF EXISTS access CASCADE;

CREATE TABLE access (
  id          varchar(26) PRIMARY KEY,
  user_id     varchar(26) REFERENCES "user"(id),
  account_id  varchar(26) REFERENCES account(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE access ADD CONSTRAINT unique_access UNIQUE (user_id, account_id);

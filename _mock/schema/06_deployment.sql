DROP TABLE IF EXISTS deployment CASCADE;

CREATE TABLE deployment (
  id              varchar(26) PRIMARY KEY,
  status          varchar(29) NOT NULL
                   CHECK (status IN ('deployment','for downgrade','for pullout',
                                      'for replacement - broken unit','for upgrade',
                                      'pullout by dealer','pullout by distributor')),
  freezer_id      varchar(26) NOT NULL REFERENCES freezer(id),
  account_id      varchar(26) NOT NULL REFERENCES account(id),
  user_id         varchar(26) NOT NULL REFERENCES "user"(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_deployment_status     ON deployment (status);
CREATE INDEX idx_deployment_freezer_id ON deployment (freezer_id);
CREATE INDEX idx_deployment_account_id ON deployment (account_id);
CREATE INDEX idx_deployment_user_id    ON deployment (user_id);

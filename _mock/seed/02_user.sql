CREATE TEMP TABLE user_raw (
  id text, first_name text, middle_name text, last_name text,
  address text, phone_no text, role text, username text,
  password text, account_id text, status text,
  created_at text, updated_at text
);
\copy user_raw FROM '/Users/owell/source/repos/hapiapp-mock/csv/user.csv' WITH (FORMAT csv, HEADER true, NULL '')

INSERT INTO "user" (id, first_name, middle_name, last_name, address, phone_no,
                    role, username, password, account_id, status)
SELECT
  TRIM(id),
  TRIM(first_name),
  TRIM(middle_name),
  TRIM(last_name),
  TRIM(address),
  TRIM(phone_no),
  TRIM(role),
  TRIM(username),
  encode(digest(TRIM(password), 'sha256'), 'hex'),
  TRIM(account_id),
  COALESCE(NULLIF(TRIM(status), ''), 'active')
FROM user_raw;

DROP TABLE user_raw;

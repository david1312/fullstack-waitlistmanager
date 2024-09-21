BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE diner_status AS ENUM ('queue', 'diner');

CREATE TABLE IF NOT EXISTS diners (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(30) NOT NULL,
    party_size INT NOT NULL,
    status diner_status NOT NULL,
    check_in_time TIMESTAMP,
    queue_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service_time INT,
    queue_counter INT NOT NULL DEFAULT 0
);

COMMIT;
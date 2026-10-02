-- Run this only if you already have an existing CareerLens database.
-- Fresh production databases created from the current models do not need this.

ALTER TABLE interview_sessions
ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- If interview_sessions already contains rows, assign each row to its owner
-- before enforcing NOT NULL. Example for a single existing development user:
-- UPDATE interview_sessions SET user_id = <YOUR_USER_ID> WHERE user_id IS NULL;

-- After all existing rows have been assigned:
-- ALTER TABLE interview_sessions ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE interview_sessions
-- ADD CONSTRAINT fk_interview_sessions_user
-- FOREIGN KEY (user_id) REFERENCES users(id);

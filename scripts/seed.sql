-- shipkit:managed v1
-- Seed data applied with `pnpm db:seed:<env>` (wrangler d1 execute --file).
-- Must stay idempotent: it may be re-run on every environment at any time, so
-- write every statement as `INSERT ... ON CONFLICT DO NOTHING` (or an UPDATE
-- that is safe to repeat). Never put user credentials or secrets here.
--
-- Example:
-- INSERT INTO setting (key, value) VALUES ('site_name', 'your app')
--   ON CONFLICT (key) DO NOTHING;

-- wrangler refuses a file with no statement in it ("SQL code did not contain a statement"), which
-- made `pnpm dev:setup` fail on a project with nothing to seed yet. This line does nothing; leave
-- it, or replace it with your first real INSERT.
SELECT 1;

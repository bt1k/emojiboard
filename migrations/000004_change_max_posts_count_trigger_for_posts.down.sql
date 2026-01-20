DROP TRIGGER trigger_maintain_max_posts ON posts;

-- The following is copied from migration 3's `up.sql` file. This down migration
-- therefore restores what the database was like before migration 4's `up.sql`
-- file.

CREATE OR REPLACE FUNCTION maintain_max_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM posts) >= 10 THEN
    DELETE FROM posts
    WHERE id = any(
      SELECT id FROM posts
      ORDER BY id ASC
      LIMIT (SELECT COUNT(*) FROM posts) - 9
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_maintain_max_posts
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION maintain_max_posts();

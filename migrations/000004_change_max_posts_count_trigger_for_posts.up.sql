DROP TRIGGER trigger_maintain_max_posts ON posts;

CREATE OR REPLACE FUNCTION maintain_max_posts()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(1);
  DELETE FROM posts
  WHERE id IN (
    SELECT id
    FROM posts
    ORDER BY id DESC
    OFFSET 10
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_maintain_max_posts
AFTER INSERT ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION maintain_max_posts();

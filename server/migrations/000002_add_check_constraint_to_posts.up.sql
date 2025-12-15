ALTER TABLE posts
ADD CONSTRAINT valid_emoji
CHECK (emoji ~* '^[🙂🙁😐😂😡]$');

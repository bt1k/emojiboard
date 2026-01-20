-- name: GetPost :one
SELECT * FROM posts
WHERE id = $1 LIMIT 1;

-- name: ListPosts :many
SELECT * FROM posts
ORDER BY id DESC LIMIT 10;

-- name: CreatePost :one
INSERT INTO posts (
  emoji
) VALUES (
  $1
)
RETURNING *;

-- name: DeletePost :exec
DELETE FROM posts
WHERE id = $1;

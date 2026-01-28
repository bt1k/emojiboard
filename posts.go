package main

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgconn"
)

type PostPostsReq struct {
	Emoji string `form:"emoji"`
}

func getPosts(c *fiber.Ctx) error {
	posts, err := dbQueries.ListPosts(c.Context())
	if err != nil {
		return err
	}
	return c.JSON(posts)
}

func postPosts(c *fiber.Ctx) error {
	req := new(PostPostsReq)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	post, err := dbQueries.CreatePost(c.Context(), req.Emoji)
	// If there's an error from Postgres, assume it's due to an invalid value in
	// the request.
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return fiber.ErrBadRequest
	}
	if err != nil {
		return err
	}
	return c.JSON(post)
}

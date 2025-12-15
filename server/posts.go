package main

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgconn"
)

type PostPostsReq struct {
	Emoji string `form:"emoji"`
}

func postPosts(c *fiber.Ctx) error {
	req := new(PostPostsReq)
	if err := c.BodyParser(req); err != nil {
		return err
	}
	post, err := dbQueries.CreatePost(c.Context(), req.Emoji)
	var pgErr *pgconn.PgError
	// If there's an error from Postgres, assume it's due to an invalid value in
	// the request.
	if errors.As(err, &pgErr) {
		return fiber.ErrBadRequest
	}
	if err != nil {
		return err
	}
	return c.JSON(post)
}

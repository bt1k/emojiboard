//go:build !dev

// This file is built when NOT using the `dev` build tag. E.g. `go build .`.

package main

import (
	"embed"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

var (
	//go:embed client/dist/*
	clientFiles embed.FS
)

func init() {
	loadEnvVariables()
	isDev = false
	listenAddress = "127.0.0.1:3000"
	// In production, the Go binary serves the built front-end. This middleware
	// makes the Go binary serve the embedded built front-end files.
	middleware = []any{
		"/",
		filesystem.New(filesystem.Config{
			// Skip this static file middleware if the path starts with "/api/".
			Next: func(c *fiber.Ctx) bool {
				return strings.HasPrefix(c.Path(), "/api/")
			},
			PathPrefix: "client/dist",
			Root:       http.FS(clientFiles),
		}),
	}
}

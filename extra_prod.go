//go:build !dev

// This file is built when NOT using the `dev` build tag. E.g. `go build .`.

package main

import (
	"embed"
	"io/fs"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

var (
	//go:embed client/dist/*
	clientFiles embed.FS
)

func init() {
	loadEnvVariables()
	// In production, the app is behind Cloudflare, so the IP address of the
	// request is in a header.
	ipTag = "reqHeader:CF-Connecting-IP"
	isDev = false
	listenAddress = "127.0.0.1:3000"
	distFiles, err := fs.Sub(clientFiles, "client/dist")
	if err != nil {
		log.Fatalln("Could not create subtree of embedded front-end files")
	}
	// In production, the Go binary serves the built front-end. This middleware
	// makes the Go binary serve the embedded built front-end files.
	middleware = []any{
		"/",
		static.New("", static.Config{
			FS: distFiles,
			// Skip this static file middleware for explicit requests for `index.html`
			// since I would prefer that only the root path is used.
			Next: func(c fiber.Ctx) bool {
				return c.Path() == "/index.html"
			},
		}),
	}
}

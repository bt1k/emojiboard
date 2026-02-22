//go:build dev

// This file is built when using the `dev` build tag. E.g.
// `go build -tags dev .`.

package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func init() {
	loadEnvVariables()
	// In development, Vite proxies requests to the back-end. Therefore the IP
	// address of each request is in a header.
	ipTag = "reqHeader:X-Forwarded-For"
	listenAddress = ":3000"
	// In development, the Go binary doesn't serve the front-end. Instead, Vite
	// serves the front-end. Therefore CORS must be enabled. I'm enabling CORS for
	// all origins, since in development this shouldn't pose security problems,
	// and it's easier than specifying individual allowed origins.
	middleware = []any{
		cors.New(cors.Config{
			AllowOrigins:  []string{"*"},
			ExposeHeaders: []string{"Retry-After"},
		}),
	}
}

// This function is only useful in production. See `extra_prod.go`.
func getRoot(c fiber.Ctx) error {
	return fiber.ErrNotFound
}

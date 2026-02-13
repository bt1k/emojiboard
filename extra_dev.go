//go:build dev

// This file is built when using the `dev` build tag. E.g.
// `go build -tags dev .`.

package main

import "github.com/gofiber/fiber/v3/middleware/cors"

func init() {
	loadEnvVariables()
	ipTag = "ip"
	isDev = true
	listenAddress = ":3000"
	// In development, the Go binary doesn't serve the front-end. Instead, Vite
	// serves the front-end. Therefore CORS must be enabled.
	middleware = []any{
		cors.New(cors.Config{
			AllowOrigins:  corsOrigins,
			ExposeHeaders: []string{"Retry-After"},
		}),
	}
}

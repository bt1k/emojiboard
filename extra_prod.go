//go:build !dev

// This file is built when NOT using the `dev` build tag. E.g. `go build .`.

package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

var (
	//go:embed client/dist/*
	clientFiles embed.FS
	buildTime   time.Time
	// Assigned to by a build flag. See `build_prod.sh`.
	buildTimeString string
)

func init() {
	loadEnvVariables()
	// In production, the app is behind Cloudflare, so the IP address of the
	// request is in a header.
	ipTag = "reqHeader:CF-Connecting-IP"
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
			// Skip this static file middleware for `index.html`. That file has its
			// own route handler (below) to specify custom caching behaviour. Also I
			// only want to send `index.html` in response to requests to the root path
			// (not explicit requests to `index.html`) because I think it's cleaner.
			Next: func(c fiber.Ctx) bool {
				return c.Path() == "/" || c.Path() == "/index.html"
			},
		}),
	}
	// Parse the build time flag into type time.Time.
	t, err := time.Parse(time.RFC3339, buildTimeString)
	if err != nil {
		log.Fatalln("Correct build flags were not provided; see `build_prod.sh`")
	}
	buildTime = t
}

// The getRoot function responds with `index.html`.
func getRoot(c fiber.Ctx) error {
	// Specify that the user's browser can cache `index.html` but the file has to
	// be validated, via its ETag (since I am using Fiber's ETag middleware) with
	// the server on each request. This should prevent an issue I encountered
	// where Chrome on my Android phone had cached `index.html` which referred to
	// assets which no longer existed (when new assets are built by Vite, they are
	// given new filenames). This resulted in the site showing a blank page
	// because the cached `index.html` was trying to load a no-longer-existing
	// JavaScript bundle. For more info on ETags, see:
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag
	// For more info on the header used below, see:
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
	c.Set("Cache-Control", "no-cache")
	err := c.SendFile("client/dist/index.html", fiber.SendFile{FS: clientFiles})
	// Set another header for caching purposes, after Fiber has set its headers
	// (when `SendFile` is called), in order to override Fiber. Because embedded
	// files have no metadata, Fiber incorrectly sets the value of this header as
	// "Mon, 01 Jan 0001 00:00:00 GMT".
	c.Set("Last-Modified", buildTime.Format(http.TimeFormat))
	return err
}

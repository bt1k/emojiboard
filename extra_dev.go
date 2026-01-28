//go:build dev

package main

func init() {
	// If the `dev` build tag is provided at build time, this boolean will show
	// that the build is for development purposes.
	isDev = true
}

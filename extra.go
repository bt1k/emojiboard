//go:build !dev

package main

func init() {
	// If the `dev` build tag is not provided at build time, this boolean will
	// show that the build is not for development purposes.
	isDev = false
}

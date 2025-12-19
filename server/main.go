package main

import (
	"context"
	"errors"
	"log"
	"os"

	"github.com/bt1k/emojiboard/server/dbqueries"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var (
	dbPool    *pgxpool.Pool
	dbQueries *dbqueries.Queries
	dbUrl     string
)

func main() {
	loadEnvVariables()
	connectToDb()
	defer dbPool.Close()
	fiberApp := fiber.New(fiber.Config{ErrorHandler: errorHandler})
	api := fiberApp.Group("/api/v1")
	api.Get("/posts", getPosts)
	api.Post("/posts", postPosts)
	err := fiberApp.Listen(":3000")
	if err != nil {
		log.Fatalln("Error:", err)
	}
}

func loadEnvVariables() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Failed to load .env file")
	}
	dbUrl = os.Getenv("EMOJIBOARD_DB_URL")
	if dbUrl == "" {
		log.Fatalln("Database environment variable not set; see README")
	}
}

func connectToDb() {
	pool, err := pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalln("Database connection failed")
	}
	dbPool = pool
	dbQueries = dbqueries.New(dbPool)
}

// The errorHandler function is a custom Fiber error handler.
func errorHandler(c *fiber.Ctx, err error) error {
	// Default error code.
	code := fiber.StatusInternalServerError
	// If error is a Fiber error, use its error code.
	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}
	// Send status code. Allow Fiber to send the default message for the error
	// code.
	return c.SendStatus(code)
}

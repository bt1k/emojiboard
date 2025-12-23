package main

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"github.com/bt1k/emojiboard/server/dbqueries"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var (
	corsOrigins string
	dbPool      *pgxpool.Pool
	dbQueries   *dbqueries.Queries
	dbUrl       string
)

func main() {
	loadEnvVariables()
	connectToDb()
	defer dbPool.Close()
	fiberApp := fiber.New(fiber.Config{ErrorHandler: errorHandler})
	fiberApp.Use(cors.New(cors.Config{AllowOrigins: corsOrigins}))
	rateLimiters := setUpRateLimiters()
	api := fiberApp.Group("/api/v1")
	api.Get("/posts", rateLimiters["getPosts"], getPosts)
	api.Post("/posts", rateLimiters["postPosts"], postPosts)
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
	corsOrigins = os.Getenv("EMOJIBOARD_CORS_ORIGINS")
	if dbUrl == "" || corsOrigins == "" {
		log.Fatalln("Database environment variables not set; see README")
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

// The setUpRateLimiters function returns a map of rate limiters.
func setUpRateLimiters() map[string]fiber.Handler {
	rateLimiters := make(map[string]fiber.Handler)
	rateLimiters["getPosts"] = limiter.New(limiter.Config{
		Expiration: 30 * time.Second,
		Max:        30,
	})
	rateLimiters["postPosts"] = limiter.New(limiter.Config{
		Expiration: 30 * time.Second,
		Max:        10,
	})
	return rateLimiters
}

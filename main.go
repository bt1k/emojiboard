package main

import (
	"context"
	"embed"
	"errors"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/bt1k/emojiboard/dbqueries"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var (
	//go:embed client/dist/*
	clientFiles embed.FS
	corsOrigins string
	dbPool      *pgxpool.Pool
	dbQueries   *dbqueries.Queries
	dbUrl       string
)

func main() {
	// Setup.
	loadEnvVariables()
	runDbMigrations()
	connectToDb()
	defer dbPool.Close()
	fiberApp := fiber.New(fiber.Config{
		ErrorHandler: errorHandler,
	})
	fiberApp.Use(cors.New(cors.Config{
		AllowOrigins:  corsOrigins,
		ExposeHeaders: "Retry-After",
	}))
	fiberApp.Use("/", filesystem.New(filesystem.Config{
		// Skip this static file middleware if the path starts with "/api/".
		Next: func(c *fiber.Ctx) bool {
			return strings.HasPrefix(c.Path(), "/api/")
		},
		PathPrefix: "client/dist",
		Root:       http.FS(clientFiles),
	}))
	rateLimiters := setUpRateLimiters()

	// Define route handlers.
	api := fiberApp.Group("/api/v1")
	api.Get("/posts", rateLimiters["getPosts"], getPosts)
	api.Post("/posts", rateLimiters["postPosts"], postPosts)

	// Start Fiber app.
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
		log.Fatalln("Environment variables not set; see README")
	}
}

func runDbMigrations() {
	log.Println("Running database migrations...")
	// Migrate expects the database URL to be prefixed with `pgx5` instead of
	// `postgres` in order to use pgx. See:
	// https://github.com/golang-migrate/migrate/tree/master/database/pgx/v5
	re := regexp.MustCompile("^postgres")
	migrateDbUrl := re.ReplaceAllString(dbUrl, "pgx5")
	m, err := migrate.New("file://migrations", migrateDbUrl)
	if err != nil {
		log.Fatalln(err)
	}
	err = m.Up()
	if errors.Is(err, migrate.ErrNoChange) {
		log.Println("No new migrations to run")
		return
	}
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("Database migrations successful")
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

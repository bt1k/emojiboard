package main

import (
	"context"
	"log"
	"os"

	"github.com/bt1k/emojiboard/server/dbqueries"
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
	queryDb()
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

func queryDb() {
	posts, err := dbQueries.ListPosts(context.Background())
	if err != nil {
		log.Fatalln("Failed to load posts from database")
	}
	log.Printf("Posts are: %+v\n", posts)
}

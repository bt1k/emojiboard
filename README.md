# emojiboard

This is a simple web application, made with Go and React, allowing you to submit emojis. These emojis are stored in a database and displayed in the React front-end.

## Running in development and production

I will fill in this section in the future.

## Running database migrations

The Go binary automatically runs database migrations when it starts. You can also run migrations by installing the `migrate` CLI (see below), and then running a command like:

`migrate -source file://migrations -database postgres://user:password@localhost:5432/emojiboard up`

## Creating new database migrations

In development, install the `migrate` CLI using the instructions [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

Once you have done that, you can generate a new migration by running a command like:

`migrate create -dir ./migrations -seq -ext sql name_of_migration`

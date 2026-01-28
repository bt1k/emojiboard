# emojiboard

This is a simple web application, made with Go and React, allowing you to submit emojis. These emojis are stored in a database and displayed in the React front-end.

## Running in development and production

To run this web application in development, just run the `dev.sh` script. You must have Go, Node.js, and tmux installed. The script won't run on Windows, but it will run on Linux VMs on top of Windows (e.g. [WSL](https://learn.microsoft.com/en-gb/windows/wsl/)).

To build this web application for production, just run the `build_prod.sh` script. Like the `dev.sh` script, it won't run on Windows. The `build_prod.sh` script builds a binary for the Linux x64 platform.

If you look at those two scripts, you will notice that `-tags dev` is added when building/running the Go binary in development. By default (without the `-tags dev` flag), the Go binary is built in production mode. This means if you want to use `go run` in development, you must run `go run -tags dev .`.

## Necessary environment variables

When the Go binary runs, it reads a file named `.env` in the same directory as the binary. Create this `.env` file (whether you're running in development or production). Don't commit this file with Git. Within the file, add the following environment variable:

* `EMOJIBOARD_DB_URL` - The URL of your Postgres database. E.g. `postgres://user:password@localhost:5432/emojiboard`.

In development (but not production) you should also add this environment variable:

* `EMOJIBOARD_CORS_ORIGINS` - A comma-separated list of all origins allowed to get responses from the back-end, under CORS rules. E.g. `http://localhost:5173`.

You can skip this next environment variable if you're using the `build_prod.sh` script. Otherwise, in the `client` directory, create another file named `.env` (again, don't commit this file with Git). Add the following environment variable to that file:

* `VITE_EMOJIBOARD_BE_ORIGIN` - The [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of your back-end. For production builds, the value should be the empty string, because the front-end is not making cross-origin requests in production. When running in development, it should be something like `http://192.168.0.50:3000`.

## Running database migrations

The Go binary automatically runs database migrations when it starts. You can also run migrations by installing the `migrate` CLI (see below), and then running a command like:

`migrate -source file://migrations -database postgres://user:password@localhost:5432/emojiboard up`

## Creating new database migrations

In development, install the `migrate` CLI using the instructions [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

Once you have done that, you can generate a new migration by running a command like:

`migrate create -dir ./migrations -seq -ext sql name_of_migration`

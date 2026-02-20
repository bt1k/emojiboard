# emojiboard

This is a simple web application, made with Go and React, allowing you to submit emojis. These emojis are stored in a database and displayed in the React front-end.

## Setup

These steps apply both when running this website in development and when building for production.

1. Clone the repo.
2. Create a Postgres database for this website.
3. Create a file named `.env` in the repo root. Within this file, define an environment variable named `EMOJIBOARD_DB_URL`. The value should be the URL of your Postgres database; e.g. `postgres://user:password@localhost:5432/emojiboard`.
4. Make sure Node.js and Go are installed. Node.js should preferably be version 24 or above. Go should be at least version 1.21, which should then automatically fetch a newer version of Go when running/building this website.
5. Navigate to the `client` directory, and then run `npm i` to install the NPM dependencies.

The next steps depend on whether you are running in development or building for production.

## Running in development

An easy way to run this website in development is to simply run the `dev.sh` script in the repo root. For this script to work, you must have tmux installed. The script will run the Go back-end and the React front-end with Vite.

The script won't work natively on Windows. You could run it with [WSL](https://learn.microsoft.com/en-gb/windows/wsl/) on top of Windows.

## Building for production

To build the website for production, just run the `build_prod.sh` script in the repo root. As with the `dev.sh` script mentioned in the development section, the `build_prod.sh` script won't work on Windows. You could run it with [WSL](https://learn.microsoft.com/en-gb/windows/wsl/) on top of Windows.

The script will create a binary which has both the back-end code and front-end code embedded within it. This binary is ready to run on a Linux x64 server. Make sure that the `.env` file you created in the "setup" steps is in the same directory as the binary when the binary is run.

## Running database migrations

The Go binary automatically runs database migrations when it starts. You can also run migrations by installing the `migrate` CLI (see below), and then running a command like:

`migrate -source file://migrations -database postgres://user:password@localhost:5432/emojiboard up`

## Creating new database migrations

In development, install the `migrate` CLI using the instructions [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

Once you have done that, you can generate a new migration by running a command like:

`migrate create -dir ./migrations -seq -ext sql name_of_migration`

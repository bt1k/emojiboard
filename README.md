# emojiboard

This is a simple web application, made with Go and React, allowing you to submit emojis. These emojis are stored in a database and displayed in the React front-end.

## Environment Variables

In the root directory of the repo, create a file named `.env` (don't commit this file with Git). Add the following environment variables to that file:

* `EMOJIBOARD_DB_URL` - The URL of your Postgres database. E.g. `postgres://user:password@localhost:5432/emojiboard`.
* `EMOJIBOARD_CORS_ORIGINS` - A comma-separated list of all origins allowed to get responses from the back-end, under CORS rules. E.g. `https://foo.com, https://bar.com`.

In the `client` directory, also create a file named `.env` (again, don't commit this file with Git). Add the following environment variables to that file:

* `VITE_EMOJIBOARD_BE_ORIGIN` - The [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of your back-end. E.g. `https://foo.com` in production, or something like `http://192.168.0.50:3000` in development.

## Database migrations

Install the `migrate` CLI using the instructions [here](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md).

Once you have done that, you can generate new migrations by running a command like:

`migrate create -dir ./migrations -seq -ext sql name_of_migration`

You can run the migrations by running a command like:

`migrate -source file://migrations -database postgres://user:password@localhost:5432/emojiboard up`

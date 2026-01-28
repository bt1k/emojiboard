#!/bin/bash

# This script builds the front-end and back-end for production.

echo "=== BUILDING FRONT-END... ==="
cd client
# Back-end origin should be the empty string, because in production the Go
# binary is serving the front-end. So instead of the front-end having to send
# requests to `https://www.example.com/api...`, it will just send requests to
# `/api...`.
VITE_EMOJIBOARD_BE_ORIGIN="" npm run build
cd ..

echo "=== BUILDING BACK-END... ==="
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -trimpath .

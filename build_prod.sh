#!/bin/bash

# This script builds the front-end and back-end for production.

echo "=== BUILDING FRONT-END... ==="
cd client
npm run build
cd ..
echo "=== BUILDING BACK-END... ==="
LD_FLAGS="-s -w -X main.buildTimeString=$(date --utc +%Y-%m-%dT%H:%M:%SZ)"
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="$LD_FLAGS" -trimpath .
echo "=== DONE ==="

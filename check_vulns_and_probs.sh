#!/bin/bash

# This script checks the codebase for vulnerabilities and problems. It also
# ensures that the code is formatted properly. Any formatting changes are staged
# with Git, and then `git diff` is run to show if there are changes to commit.

# You must install the following for this script to work:
# * Node.js (version 24 or later recommended; earlier versions may also work)
# * Go (version 1.21 or later, since versions from 1.21 should automatically
#   download any newer Go version as needed)

echo "=== INSTALLING GOVULNCHECK IF NECESSARY... ==="
go install golang.org/x/vuln/cmd/govulncheck@latest

echo "=== CHECKING GO VULNERABILITIES... ==="
~/go/bin/govulncheck .

echo "=== RUNNING GO VET... ==="
go vet .

echo "=== FORMATTING GO CODE... ==="
go fmt .

echo "=== CHECKING NPM VULNERABILITIES... ==="
cd client
npm audit

echo "=== CHECKING NPM OUTDATED PACKAGES... ==="
npm outdated

echo "=== RUNNING ESLINT... ==="
npm run lint

echo "=== FORMATTING TYPESCRIPT CODE... ==="
npm run format

echo "=== ADDING POSSIBLE CHANGES TO GIT AND SHOWING DIFF... ==="
cd ..
git add .
git diff --staged

echo "=== SCRIPT FINISHED ==="

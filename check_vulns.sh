#!/bin/bash

# This script checks the codebase for vulnerabilities.
# You must install the following for this script to work:
# * Node.js (version 24 or later recommended; earlier versions may also work)
# * Go (I think any version should be okay because when `go run` is run, I think
#   it will download the Go version specified in the file `go.mod`)

echo "=== INSTALLING GOVULNCHECK IF NECESSARY... ==="
go install golang.org/x/vuln/cmd/govulncheck@latest
echo "=== CHECKING GO VULNERABILITIES... ==="
~/go/bin/govulncheck .
echo "=== CHECKING NODE.JS VULNERABILITIES... ==="
cd client
npm audit

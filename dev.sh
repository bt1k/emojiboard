#!/bin/bash

# This script starts the back-end and front-end in development.
# You must install the following for this script to work:
# * tmux
# * Node.js (version 24 or later recommended; earlier versions may also work)
# * Go (I think any version should be okay because when `go run` is run, I think
#   it will download the Go version specified in the file `go.mod`)

SESSION_NAME="emojiboard"

if tmux has-session -t $SESSION_NAME 2>/dev/null; then
  echo "Session $SESSION_NAME exists; attaching to it"
else
  tmux new-session -d -s $SESSION_NAME
  tmux split-window -v
  tmux send-keys -t 0 "go run ." C-m
  tmux send-keys -t 1 "cd client" C-m
  tmux send-keys -t 1 "npm run dev" C-m
fi

tmux attach-session -t $SESSION_NAME

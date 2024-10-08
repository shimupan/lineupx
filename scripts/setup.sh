#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

check_and_copy_env() {
  local dir=$1
  cd "$dir" || exit 1

  if [ ! -f .env ]; then
    cp .env.example .env
  fi

  cd - > /dev/null || exit 1
}

# Navigate to src/api and check .env
check_and_copy_env "$SCRIPT_DIR/../src/api"

# Navigate to src/web and check .env
check_and_copy_env "$SCRIPT_DIR/../src/web"
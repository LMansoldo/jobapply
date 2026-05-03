#!/bin/bash
set -e
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
yarn install

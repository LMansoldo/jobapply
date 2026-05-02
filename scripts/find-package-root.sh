#!/usr/bin/env bash
# find-package-root.sh
# Walks up from a given file path to find the nearest package.json
# that is NOT the workspace root (i.e., does not contain "workspaces" key).
# Usage: ./find-package-root.sh /absolute/path/to/edited/file
# Prints the package root directory, or exits 1 if not found.

set -euo pipefail

FILE_PATH="${1:-}"

if [[ -z "$FILE_PATH" ]]; then
  echo "Usage: find-package-root.sh <file-path>" >&2
  exit 1
fi

dir="$(dirname "$FILE_PATH")"

while [[ "$dir" != "/" ]]; do
  pkg="$dir/package.json"
  if [[ -f "$pkg" ]]; then
    # Skip if it's the workspace root (has "workspaces" key)
    if ! python3 -c "import sys,json; d=json.load(open('$pkg')); sys.exit(0 if 'workspaces' in d else 1)" 2>/dev/null; then
      echo "$dir"
      exit 0
    fi
  fi
  dir="$(dirname "$dir")"
done

echo "No package root found for: $FILE_PATH" >&2
exit 1

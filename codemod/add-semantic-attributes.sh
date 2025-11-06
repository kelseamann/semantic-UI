#!/bin/bash

# Add Semantic Attributes to PatternFly Components
# 
# This script runs a jscodeshift codemod that adds standardized data-* attributes
# to all PatternFly components in your codebase, making them more AI-friendly.
#
# Usage:
#   ./codemod/add-semantic-attributes.sh [path/to/files]
#
# Examples:
#   ./codemod/add-semantic-attributes.sh src/
#   ./codemod/add-semantic-attributes.sh src/components/MyComponent.tsx
#   ./codemod/add-semantic-attributes.sh  # transforms current directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Default path is current directory if not provided
TARGET_PATH="${1:-.}"

# Check if jscodeshift is installed
if ! command -v jscodeshift &> /dev/null; then
    echo -e "${RED}Error: jscodeshift is not installed${NC}"
    echo "Installing jscodeshift globally..."
    npm install -g jscodeshift
fi

# Check if target path exists
if [ ! -e "$TARGET_PATH" ]; then
    echo -e "${RED}Error: Path '$TARGET_PATH' does not exist${NC}"
    exit 1
fi

echo -e "${GREEN}Adding semantic attributes to PatternFly components...${NC}"
echo "Target: $TARGET_PATH"
echo ""

# Run jscodeshift
jscodeshift \
  --transform="$SCRIPT_DIR/transform.js" \
  --extensions=ts,tsx,js,jsx \
  --parser=tsx \
  "$TARGET_PATH"

echo ""
echo -e "${GREEN}✓ Transformation complete!${NC}"
echo ""
echo "All PatternFly components now have standardized data-* attributes:"
echo "  - data-role      (what the component IS)"
echo "  - data-purpose   (what it DOES)"
echo "  - data-variant   (how it LOOKS)"
echo "  - data-context   (where it's USED)"
echo "  - data-state     (current STATE)"
echo ""
echo "These attributes will appear on the rendered DOM elements in your browser."
echo "You can verify by inspecting the HTML in DevTools."
echo ""
echo "Example: <button class='pf-c-button' data-role='button' data-purpose='action'>"


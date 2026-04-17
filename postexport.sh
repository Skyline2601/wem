#!/bin/bash
# Run after expo export to add demo.html to dist
if [ -f "demo.html" ]; then
  cp demo.html dist/demo.html
  echo "✓ demo.html copied to dist/"
fi

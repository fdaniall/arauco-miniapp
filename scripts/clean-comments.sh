#!/bin/bash

find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read file; do
  sed -i.bak '/^[[:space:]]*\/\//d' "$file"
  sed -i.bak '/^[[:space:]]*\/\*/,/\*\//d' "$file"
  sed -i.bak 's/\/\/.*$//' "$file"
  rm -f "${file}.bak"
done

echo "Comments cleaned from all source files"

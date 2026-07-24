#!/bin/bash
# CyberSec Portfolio - Linux Desktop Launcher
# Zorin OS / Ubuntu / Debian compatible

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "[!] Installing dependencies..."
  npm install
fi

# Check if build exists
if [ ! -d "docs" ] || [ ! -f "docs/index.html" ]; then
  echo "[!] Building application..."
  npm run build
fi

echo "[+] Launching CyberSec Portfolio..."
npx electron .

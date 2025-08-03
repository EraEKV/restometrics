#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building application..."
pnpm run build:render

echo "Build completed successfully!"
ls -la dist/

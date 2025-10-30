#!/bin/bash

# Start local Verdaccio registry for Mastra development
echo "Starting local Verdaccio registry..."

# Create storage directory if it doesn't exist
mkdir -p storage

# Start Verdaccio with custom config
verdaccio --config verdaccio-config.yaml --listen 4873

echo "Verdaccio registry started on http://localhost:4873"
echo "Access the web interface at: http://localhost:4873"
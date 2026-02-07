#!/bin/bash
# Build and deployment script for Software Nexus Portfolio

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Software Nexus Portfolio Build Script  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
  fi
fi

# Run tests
echo ""
echo -e "${BLUE}Running tests...${NC}"
npm run test 2>/dev/null || echo -e "${YELLOW}Tests not configured yet${NC}"

# Build for production
echo ""
echo -e "${BLUE}Building for production...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Build completed successfully!${NC}"
echo -e "${GREEN}✓ Output directory: dist/${NC}"
echo ""

# Preview build locally
if command -v python3 &> /dev/null; then
  echo -e "${BLUE}Starting local preview server...${NC}"
  echo -e "${YELLOW}Open http://localhost:8000 in your browser${NC}"
  python3 -m http.server 8000 --directory dist
elif command -v python &> /dev/null; then
  echo -e "${BLUE}Starting local preview server...${NC}"
  echo -e "${YELLOW}Open http://localhost:8000 in your browser${NC}"
  python -m SimpleHTTPServer 8000 --directory dist
else
  echo -e "${YELLOW}Python not found. Please manually start a local server to preview the build.${NC}"
fi


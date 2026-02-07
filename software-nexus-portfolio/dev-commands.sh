#!/usr/bin/env bash

# Developer Command Reference for Software Nexus Portfolio
# Quick commands for common development tasks

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Main menu
show_menu() {
    print_header "Software Nexus Portfolio - Developer Commands"
    echo "1. Start dev server (npm run dev)"
    echo "2. Build for production (npm run build)"
    echo "3. Preview production build (npm run preview)"
    echo "4. Run tests (npm run test)"
    echo "5. Type checking (npm run type-check)"
    echo "6. Lint code (npm run lint)"
    echo "7. Install dependencies (npm install)"
    echo "8. Format code (optional)"
    echo "9. View project status"
    echo "10. View task progress"
    echo "11. Exit"
    echo ""
}

# Command functions
start_dev() {
    print_header "Starting Development Server"
    print_info "Server will start at http://localhost:5173"
    npm run dev
}

build_prod() {
    print_header "Building for Production"
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Production build completed"
        print_info "Output directory: dist/"
    else
        print_error "Build failed"
    fi
}

preview_build() {
    print_header "Previewing Production Build"
    npm run preview 2>/dev/null || print_error "Preview script not configured"
}

run_tests() {
    print_header "Running Tests"
    npm run test
}

type_check() {
    print_header "Type Checking"
    npm run type-check || print_error "Type checking failed"
}

lint_code() {
    print_header "Linting Code"
    npm run lint || print_error "Linting failed"
}

install_deps() {
    print_header "Installing Dependencies"
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed"
    else
        print_error "Installation failed"
    fi
}

view_status() {
    print_header "Project Status"
    echo "Version: 0.8.0"
    echo "Completion: 78.6% (33/42 tasks)"
    echo "Last Updated: February 7, 2026"
    echo ""
    echo "Completed Phases:"
    echo "  ✓ Phase 1: Foundation"
    echo "  ✓ Phase 2: Core 3D Scene"
    echo "  ✓ Phase 3: World Geometry"
    echo "  ✓ Phase 4: Interaction Systems"
    echo "  ✓ Phase 5: Project Portals"
    echo "  ✓ Phase 6: Skills Visualization"
    echo "  ✓ Phase 7: Content Management"
    echo "  ✓ Phase 8: Performance Optimization"
    echo ""
    echo "Upcoming Phases:"
    echo "  ○ Phase 9: Accessibility & Fallback Systems"
    echo "  ○ Phase 10: Engineering Mode & Debug Tools"
    echo "  ○ Phase 11: Audio & Enhanced Experience"
    echo "  ○ Phase 12: Testing & Quality Assurance"
    echo "  ○ Phase 13: Deployment & Optimization"
    echo "  ○ Phase 14: Final Integration & Polish"
}

view_progress() {
    print_header "Task Progress"
    if [ -f ".kiro/specs/software-nexus-portfolio/progress.md" ]; then
        head -100 .kiro/specs/software-nexus-portfolio/progress.md
    elif [ -f "progress.md" ]; then
        head -100 progress.md
    else
        print_error "Progress file not found"
    fi
}

# Main script
main() {
    while true; do
        show_menu
        read -p "Select an option (1-11): " choice

        case $choice in
            1) start_dev ;;
            2) build_prod ;;
            3) preview_build ;;
            4) run_tests ;;
            5) type_check ;;
            6) lint_code ;;
            7) install_deps ;;
            8)
                print_info "Using prettier if available"
                npx prettier --write "src/**/*.{ts,tsx,css}" 2>/dev/null || print_error "Prettier not found"
                ;;
            9) view_status ;;
            10) view_progress ;;
            11)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option"
                ;;
        esac

        read -p "Press Enter to continue..."
    done
}

# Check if running with argument (for direct command execution)
if [ $# -gt 0 ]; then
    case $1 in
        dev) start_dev ;;
        build) build_prod ;;
        preview) preview_build ;;
        test) run_tests ;;
        type) type_check ;;
        lint) lint_code ;;
        status) view_status ;;
        progress) view_progress ;;
        *)
            echo "Usage: $0 {dev|build|preview|test|type|lint|status|progress}"
            echo "Or run without arguments for interactive menu"
            ;;
    esac
else
    main
fi


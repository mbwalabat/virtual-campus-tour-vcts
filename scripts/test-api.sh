#!/bin/bash

# Campus Navigation Backend API Test Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:5000"
API_URL="$BASE_URL/api"

# Function to print colored output
print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local url="$2"
    local expected_status="$3"
    local method="${4:-GET}"
    local data="${5:-}"
    local headers="${6:-}"
    
    print_test "$test_name"
    
    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "%{http_code}" -X "$method" -H "$headers" -d "$data" "$url")
        else
            response=$(curl -s -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
        fi
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$url")
    fi
    
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$test_name - Status: $status_code"
        ((TESTS_PASSED++))
        return 0
    else
        print_fail "$test_name - Expected: $expected_status, Got: $status_code"
        echo "Response: $body"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to extract token from login response
extract_token() {
    local response="$1"
    echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4
}

echo "🧪 Starting Campus Navigation Backend API Tests"
echo "Base URL: $BASE_URL"
echo "=========================================="

# Test 1: Health Check
run_test "Health Check" "$BASE_URL/health" "200"

# Test 2: Get Locations (Public)
run_test "Get Locations (Public)" "$API_URL/locations" "200"

# Test 3: Get Departments (Public)
run_test "Get Departments (Public)" "$API_URL/departments" "200"

# Test 4: Get Location Stats (Public)
run_test "Get Location Stats" "$API_URL/locations/stats" "200"

# Test 5: Get Department Stats (Public)
run_test "Get Department Stats" "$API_URL/departments/stats" "200"

# Test 6: Invalid Route
run_test "Invalid Route" "$API_URL/invalid-route" "404"

# Test 7: User Registration
print_test "User Registration"
register_data='{"name":"Test User","email":"test@example.com","password":"password123"}'
register_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$register_data" "$API_URL/auth/register")
register_status="${register_response: -3}"
register_body="${register_response%???}"

if [ "$register_status" = "201" ]; then
    print_success "User Registration - Status: $register_status"
    ((TESTS_PASSED++))
    # Extract token for further tests
    USER_TOKEN=$(echo "$register_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    print_info "User token extracted for further tests"
else
    print_fail "User Registration - Expected: 201, Got: $register_status"
    echo "Response: $register_body"
    ((TESTS_FAILED++))
fi

# Test 8: User Login
print_test "User Login"
login_data='{"email":"test@example.com","password":"password123"}'
login_response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$login_data" "$API_URL/auth/login")
login_status="${login_response: -3}"
login_body="${login_response%???}"

if [ "$login_status" = "200" ]; then
    print_success "User Login - Status: $login_status"
    ((TESTS_PASSED++))
else
    print_fail "User Login - Expected: 200, Got: $login_status"
    echo "Response: $login_body"
    ((TESTS_FAILED++))
fi

# Test 9: Get Profile (Authenticated)
if [ -n "$USER_TOKEN" ]; then
    run_test "Get User Profile" "$API_URL/auth/profile" "200" "GET" "" "Authorization: Bearer $USER_TOKEN"
else
    print_fail "Get User Profile - No token available"
    ((TESTS_FAILED++))
fi

# Test 10: Access Admin Route (Should Fail)
if [ -n "$USER_TOKEN" ]; then
    run_test "Access Admin Route (Should Fail)" "$API_URL/users" "403" "GET" "" "Authorization: Bearer $USER_TOKEN"
else
    print_fail "Access Admin Route Test - No token available"
    ((TESTS_FAILED++))
fi

# Test 11: Invalid Login
run_test "Invalid Login" "$API_URL/auth/login" "401" "POST" '{"email":"invalid@example.com","password":"wrongpassword"}'

# Test 12: Missing Authentication
run_test "Missing Authentication" "$API_URL/auth/profile" "401"

# Test 13: Invalid Token
run_test "Invalid Token" "$API_URL/auth/profile" "401" "GET" "" "Authorization: Bearer invalid_token"

# Test 14: Validation Error
run_test "Validation Error - Invalid Email" "$API_URL/auth/register" "400" "POST" '{"name":"Test","email":"invalid-email","password":"123"}'

# Test 15: Get Single Location (Non-existent)
run_test "Get Non-existent Location" "$API_URL/locations/507f1f77bcf86cd799439011" "404"

# Test 16: Rate Limiting Test (Optional - commented out to avoid hitting limits)
# print_info "Skipping rate limiting test to avoid hitting actual limits"

echo ""
echo "=========================================="
echo "🏁 Test Results Summary"
echo "=========================================="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi


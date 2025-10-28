#!/bin/bash

# Spam Protection Testing Script
# Usage: bash test-spam-protection.sh

BASE_URL="http://localhost:3000/api/contact"
RESET='\033[0m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'

echo -e "${BLUE}=== Spam Protection Testing Script ===${RESET}\n"

# Test counter
PASSED=0
FAILED=0

# Test function
test_submission() {
  local test_name=$1
  local name=$2
  local email=$3
  local message=$4
  local expected_status=$5
  local expected_error_contains=$6

  echo -e "${YELLOW}Testing: $test_name${RESET}"

  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"email\": \"$email\",
      \"message\": \"$message\"
    }")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$http_code" -eq "$expected_status" ]; then
    if [ -z "$expected_error_contains" ] || echo "$body" | grep -q "$expected_error_contains"; then
      echo -e "${GREEN}✓ PASSED${RESET} (HTTP $http_code)"
      ((PASSED++))
    else
      echo -e "${RED}✗ FAILED${RESET} (HTTP $http_code, expected error containing: $expected_error_contains)"
      echo "Response: $body"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗ FAILED${RESET} (HTTP $http_code, expected $expected_status)"
    echo "Response: $body"
    ((FAILED++))
  fi
  echo
}

# Valid submissions
echo -e "${BLUE}--- Valid Submissions ---${RESET}\n"
test_submission "Valid submission" "John Doe" "john@example.com" "This is a legitimate inquiry about your services and expertise." 200 ""

# Spam detection
echo -e "${BLUE}--- Spam Detection ---${RESET}\n"
test_submission "Spam: Random characters in name" "zqfCeQmScGknKdDGkdljpS" "spam@example.com" "This is a reasonable message that would be legitimate." 400 ""
test_submission "Spam: Random characters in message" "John Doe" "john@example.com" "azljxQrEiBwanyHOpjFjjhfm" 400 "special characters"
test_submission "Spam: Excessive special characters" "John Doe" "john@example.com" "!@#\$%^&*()!@#\$%^&*()!@#\$%^&*()!@#\$%^&*()" 400 "special characters"
test_submission "Spam: Mostly uppercase" "John Doe" "john@example.com" "THIS IS A SPAM MESSAGE WITH MOSTLY UPPERCASE LETTERS" 400 "uppercase"

# Validation errors
echo -e "${BLUE}--- Validation Errors ---${RESET}\n"
test_submission "Empty form" "" "" "" 400 ""
test_submission "Name too short" "J" "john@example.com" "This is a valid message content here." 400 "at least 2"
test_submission "Invalid email" "John Doe" "notanemail" "This is a valid message content here." 400 "valid email"
test_submission "Message too short" "John Doe" "john@example.com" "Short" 400 "at least 10"
test_submission "Message too long" "John Doe" "john@example.com" "$(printf 'A%.0s' {1..5001})" 400 "less than 5000"

# Valid edge cases
echo -e "${BLUE}--- Valid Edge Cases ---${RESET}\n"
test_submission "Name with hyphen and apostrophe" "Mary-Jane O'Connor" "mary@example.com" "This is a legitimate inquiry from someone with a hyphenated name." 200 ""

# Rate limiting test
echo -e "${BLUE}--- Rate Limiting (5 per hour per IP) ---${RESET}\n"
echo -e "${YELLOW}Note: Rate limiting is per IP. Run 5 submissions quickly to see it activate.${RESET}\n"

for i in {1..5}; do
  test_submission "Rate limit test - submission $i" "John Doe" "test$i@example.com" "This is submission number $i for rate limit testing purposes." 200 ""
done

test_submission "Rate limit test - submission 6 (should be blocked)" "John Doe" "test6@example.com" "This is submission 6 and should be rate limited." 429 "Too many submissions"

# Summary
echo -e "${BLUE}=== Test Summary ===${RESET}"
echo -e "${GREEN}Passed: $PASSED${RESET}"
echo -e "${RED}Failed: $FAILED${RESET}"
echo -e "Total: $((PASSED + FAILED))"

if [ "$FAILED" -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed!${RESET}"
  exit 0
else
  echo -e "\n${RED}Some tests failed.${RESET}"
  exit 1
fi

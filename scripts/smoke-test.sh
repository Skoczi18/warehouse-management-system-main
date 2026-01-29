#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8000}"

if [[ -z "${TOKEN:-}" ]]; then
  echo "Missing TOKEN. Export TOKEN=<jwt> and rerun."
  exit 1
fi

auth_header=(-H "Authorization: Bearer ${TOKEN}")

echo "Health..."
curl -fsS "${API_URL}/health" >/dev/null

echo "List products..."
curl -fsS "${API_URL}/products" "${auth_header[@]}" >/dev/null

echo "List stock..."
curl -fsS "${API_URL}/stock" "${auth_header[@]}" >/dev/null

echo "List deliveries..."
curl -fsS "${API_URL}/deliveries" "${auth_header[@]}" >/dev/null

echo "List orders..."
curl -fsS "${API_URL}/orders" "${auth_header[@]}" >/dev/null

echo "Report audit..."
curl -fsS "${API_URL}/reports/audit" "${auth_header[@]}" >/dev/null

echo "Smoke test OK"

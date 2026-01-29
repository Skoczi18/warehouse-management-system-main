#!/usr/bin/env bash
set -e

DOMAINS=(
  "api.warehouse.test"
  "dashboard.warehouse.test"
)

HOSTS_FILE="/etc/hosts"
IP="127.0.0.1"

echo "Registering local dev domains"

for domain in "${DOMAINS[@]}"; do
  if grep -qE "^[^#]*\s+$domain" "$HOSTS_FILE"; then
    echo "$domain already exists"
  else
    echo "$IP $domain" | sudo tee -a "$HOSTS_FILE" > /dev/null
    echo "Added $domain"
  fi
done

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Flushing macOS DNS cache"
  sudo dscacheutil -flushcache
  sudo killall -HUP mDNSResponder || true
else
  echo "Restarting Linux DNS services"
  sudo systemctl restart systemd-resolved 2>/dev/null || true
fi

echo "Done"

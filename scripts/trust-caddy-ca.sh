#!/usr/bin/env bash
set -e

CA_RELATIVE_PATH="./data/caddy/data/caddy/pki/authorities/local/root.crt"

if [[ ! -f "$CA_RELATIVE_PATH" ]]; then
  echo "Caddy local CA not found at:"
  echo "   $CA_RELATIVE_PATH"
  echo ""
  exit 1
fi

echo "Trusting Caddy local CA"
echo "CA file: $CA_RELATIVE_PATH"
echo ""

OS="$(uname -s)"

# =========================
# macOS
# =========================
if [[ "$OS" == "Darwin" ]]; then
  echo "Detected macOS"

  echo "Adding CA to System Keychain (Safari / Chrome / Chromium)"
  sudo security add-trusted-cert \
    -d -r trustRoot \
    -k /Library/Keychains/System.keychain \
    "$CA_RELATIVE_PATH" || true

  echo "Configuring Firefox (enterprise roots)"

  FIREFOX_DIRS=(
    "$HOME/Library/Application Support/Firefox"
    "$HOME/.mozilla/firefox"
  )

  for dir in "${FIREFOX_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
      mkdir -p "$dir"
      cat > "$dir/policies.json" <<EOF
{
  "policies": {
    "Certificates": {
      "ImportEnterpriseRoots": true
    }
  }
}
EOF
      echo "✔ Firefox policy written to $dir/policies.json"
    fi
  done

# =========================
# Linux
# =========================
elif [[ "$OS" == "Linux" ]]; then
  echo "Detected Linux"

  echo "Installing CA system-wide (Chrome / Chromium)"
  sudo cp "$CA_RELATIVE_PATH" \
    /usr/local/share/ca-certificates/caddy-local.crt

  sudo update-ca-certificates

  echo "Configuring Firefox (enterprise roots)"

  FIREFOX_POLICY_DIR="/etc/firefox/policies"
  sudo mkdir -p "$FIREFOX_POLICY_DIR"

  sudo tee "$FIREFOX_POLICY_DIR/policies.json" > /dev/null <<EOF
{
  "policies": {
    "Certificates": {
      "ImportEnterpriseRoots": true
    }
  }
}
EOF

  echo "✔ Firefox policy written to $FIREFOX_POLICY_DIR/policies.json"

else
  echo "Unsupported OS: $OS"
  exit 1
fi

echo ""
echo "DONE"
echo ""
echo "🔁 Restart browsers:"
echo "   - Safari"
echo "   - Chrome / Chromium"
echo "   - Firefox"
echo ""

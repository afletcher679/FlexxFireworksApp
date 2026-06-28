#!/usr/bin/env bash
#
# Downloads the Let's Encrypt "ISRG Root X1" root certificate (PEM) and stores
# it at android-assets/isrg_root_x1.pem so the withLetsEncryptNetworkSecurity
# config plugin can bundle it into the Android app.
#
# This certificate is PUBLIC (it's a root CA), so it's safe to commit.
#
# Usage:
#   bash scripts/download-isrg-cert.sh
#
set -euo pipefail

DEST_DIR="android-assets"
DEST_FILE="${DEST_DIR}/isrg_root_x1.pem"
URL="https://letsencrypt.org/certs/isrgrootx1.pem"

mkdir -p "${DEST_DIR}"

echo "Downloading ISRG Root X1 from ${URL} ..."
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${URL}" -o "${DEST_FILE}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${DEST_FILE}" "${URL}"
else
  echo "ERROR: need curl or wget installed." >&2
  exit 1
fi

# Sanity check: must look like a PEM certificate
if ! grep -q "BEGIN CERTIFICATE" "${DEST_FILE}"; then
  echo "ERROR: downloaded file is not a PEM certificate." >&2
  cat "${DEST_FILE}" >&2 || true
  exit 1
fi

echo "Saved certificate to ${DEST_FILE}"
echo "Done. Now run: npx expo prebuild --clean"

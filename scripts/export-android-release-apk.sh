#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APK_SRC="$ROOT_DIR/android/app/build/outputs/apk/release/app-release.apk"
APK_DST_DIR="$ROOT_DIR/artifacts/android"
APK_DST="$APK_DST_DIR/app-release.apk"

if [[ ! -f "$APK_SRC" ]]; then
  echo "Release APK not found at: $APK_SRC"
  echo "Build it first with: npm run android:release:apk"
  exit 1
fi

mkdir -p "$APK_DST_DIR"
cp "$APK_SRC" "$APK_DST"

echo "Exported APK to: $APK_DST"

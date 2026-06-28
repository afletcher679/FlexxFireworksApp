# TestFlight Setup — Flexx Fireworks

TestFlight lets your testers install the app like a normal app — **no Developer Mode, no UDID registration, no public App Store listing.**

- **Internal Testing** (up to 100 testers): **no App Review**, available within ~10–30 min of upload.
- **External Testing** (up to 10,000): requires a one-time light "Beta App Review".

For you + a few people, use **Internal Testing**.

---

## Prerequisites

- Paid Apple Developer Program account (you have it — Team `89F8DQ79UH`).
- Each tester needs: a free Apple ID + the free **TestFlight** app from the App Store.

---

## Step 1 — Create the App Store Connect app record (one time)

1. Go to https://appstoreconnect.apple.com → **My Apps** → **+** → **New App**.
2. Fill in:
   - **Platform:** iOS
   - **Name:** `Flexx Fireworks`
   - **Primary Language:** English
   - **Bundle ID:** select `com.flexxfireworks` (must already exist in your Developer account — EAS creates it on first build, or create it at developer.apple.com → Identifiers).
   - **SKU:** any unique string, e.g. `flexxfireworks001`
   - **User Access:** Full Access
3. Click **Create**.
4. After creation, find the **numeric App ID** (a.k.a. `ascAppId`):
   - On the app's page, look at the URL: `.../app/`**`XXXXXXXXXX`**`/...` — that number is your `ascAppId`.

---

## Step 2 — Fill in `eas.json` submit credentials

Edit `eas.json` → `submit.production.ios`:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-account@email.com",
      "ascAppId": "XXXXXXXXXX",
      "appleTeamId": "89F8DQ79UH"
    }
  }
}
```

- `appleId` — the email you log into Apple Developer / App Store Connect with.
- `ascAppId` — the numeric ID from Step 1.4.
- `appleTeamId` — already filled in (`89F8DQ79UH`).

---

## Step 3 — Build for the App Store (distribution signing)

```bash
eas build --platform ios --profile production
```

- EAS will create/reuse a **Distribution Certificate** and an **App Store provisioning profile** (different from Ad Hoc — no UDIDs needed).
- `appVersionSource` is `remote` and `autoIncrement` is on, so EAS bumps the build number automatically.

---

## Step 4 — Submit to TestFlight

```bash
eas submit --platform ios --profile production --latest
```

- `--latest` submits the most recent finished iOS build. (Or use `--id <BUILD_ID>` for a specific build.)
- EAS uploads the `.ipa` to App Store Connect. Processing takes ~10–30 min.
- You may be prompted for an **app-specific password** for your Apple ID (create one at https://appleid.apple.com → Sign-In and Security → App-Specific Passwords). EAS will guide you, or you can use an **App Store Connect API key** (recommended — see Step 6).

---

## Step 5 — Add testers (Internal Testing — no review)

1. App Store Connect → your app → **TestFlight** tab.
2. Under **Internal Testing**, create a group (e.g. "Team").
3. Add testers by their App Store Connect user email (add them as Users first under **Users and Access** if they aren't on your team).
4. Once the build finishes processing, enable it for the group.
5. Testers get an email → open in the **TestFlight** app → **Install**. Done. No Developer Mode.

> For people NOT on your App Store Connect team, use **External Testing** instead — same flow but the first build needs a one-time Beta App Review (~1 day). After that, builds auto-approve. External supports an invite **link** so you don't need their Apple ID up front.

---

## Step 6 (Recommended) — App Store Connect API key for hands-free submits

Instead of entering an Apple ID password each time:

1. App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API** → **+** to create a key (role: App Manager).
2. Download the `.p8` file (you can only download it once).
3. Note the **Key ID** and **Issuer ID**.
4. Run `eas submit` and choose the API key option, or configure it via EAS credentials. EAS will store it securely.

---

## Quick command reference

```bash
# Build for TestFlight
eas build --platform ios --profile production

# Submit latest build to TestFlight
eas submit --platform ios --profile production --latest

# Check build status
eas build:list --platform ios --limit 5
```

---

## Why this avoids Developer Mode

Per Expo's docs, iOS 16+ requires **Developer Mode** for **internal distribution** (Ad Hoc) and **local development** builds. TestFlight builds are **App Store distribution** signed and delivered through the TestFlight app — they are explicitly **not** internal distribution, so **Developer Mode is never required.**

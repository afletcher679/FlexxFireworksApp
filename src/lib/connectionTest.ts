/**
 * Standalone TLS / connectivity diagnostic.
 *
 * Call runConnectionDiagnostics() from a screen (e.g. on a button press or in a
 * useEffect) to find out WHERE the "Trust anchor for certification path not
 * found" error actually comes from.
 *
 * It tests three layers independently:
 *   1. A control request to a well-known HTTPS host (google) — proves the
 *      device's TLS stack works AT ALL.
 *   2. A RAW fetch to your Supabase REST endpoint (bypasses the supabase-js SDK)
 *      — isolates whether the failure is in Android's native HTTP/TLS or in the
 *      SDK / its realtime websocket setup.
 *   3. The supabase-js client itself.
 *
 * Read the console output (adb logcat | grep ReactNativeJS) to interpret:
 *   - If (1) fails too  -> device/emulator TLS or network is broken (wipe/cold
 *     boot emulator, check clock, check proxy).
 *   - If (1) ok but (2) fails -> something specific to the Supabase host on the
 *     device (rare; usually emulator trust store / clock).
 *   - If (1) and (2) ok but (3) fails -> the bug is in supabase-js usage
 *     (e.g. the realtime/ws transport block) -> fix supabase.ts.
 */

const SUPABASE_URL = "https://yyfzasangyvqglqiaiod.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Znphc2FuZ3l2cWdscWlhaW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzUzNTQsImV4cCI6MjA5NzY1MTM1NH0.QKd7zZ8bqE1Spm32YXhUHpewlKq3MMpdRJxfRbE7s7E";

export async function runConnectionDiagnostics() {
  console.log("=== CONNECTION DIAGNOSTICS START ===");

  // 1. Control: generic HTTPS request
  try {
    const r = await fetch("https://www.google.com/generate_204");
    console.log("[1] Control HTTPS (google):", r.status);
  } catch (e: any) {
    console.error("[1] Control HTTPS FAILED:", e?.message ?? e);
  }

  // 2. Raw fetch to Supabase REST (no SDK)
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    console.log("[2] Raw fetch Supabase REST:", r.status);
  } catch (e: any) {
    console.error("[2] Raw fetch Supabase FAILED:", e?.message ?? e);
  }

  // 3. supabase-js client
  try {
    const { supabase } = await import("./supabase");
    const { error } = await supabase.from("fireworks").select("count");
    if (error) {
      console.error("[3] supabase-js query error:", error.message);
    } else {
      console.log("[3] supabase-js query OK");
    }
  } catch (e: any) {
    console.error("[3] supabase-js threw:", e?.message ?? e);
  }

  console.log("=== CONNECTION DIAGNOSTICS END ===");
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

// NOTE: no trailing slash — a trailing slash can cause malformed request URLs
const supabaseUrl = "https://yyfzasangyvqglqiaiod.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Znphc2FuZ3l2cWdscWlhaW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzUzNTQsImV4cCI6MjA5NzY1MTM1NH0.QKd7zZ8bqE1Spm32YXhUHpewlKq3MMpdRJxfRbE7s7E";

/**
 * Runtime detection.
 *
 * React Native provides a global `WebSocket`, a global `fetch`, and sets
 * `navigator.product === "ReactNative"`. We ONLY attempt the Node `ws` shim
 * when we're genuinely on Node WITHOUT a global WebSocket (e.g. SSR / scripts).
 * On React Native we must NEVER `require("ws")` — it isn't in the bundle and
 * throwing there can crash module init or break the realtime client.
 */
const isReactNative =
  typeof navigator !== "undefined" &&
  (navigator as any).product === "ReactNative";

const hasGlobalWebSocket = typeof (globalThis as any).WebSocket !== "undefined";

const isNodeWithoutWebSocket =
  !isReactNative &&
  !hasGlobalWebSocket &&
  typeof process !== "undefined" &&
  !!(process as { versions?: { node?: string } }).versions?.node;

const realtimeOptions: { transport?: any } = {};

if (isNodeWithoutWebSocket) {
  try {
    // Only reached in a real Node runtime (never in the RN bundle).
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const wsModule = require("ws");
    realtimeOptions.transport = wsModule?.WebSocket ?? wsModule;
  } catch {
    // No ws available; leave transport unset. Realtime simply won't be used.
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: realtimeOptions,
  auth: {
    // Recommended for React Native: persist the session in AsyncStorage and
    // don't try to read the URL for OAuth redirects on every call.
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("fireworks").select("count");
    if (error) {
      console.error("Connection failed:", error);
      return false;
    }
    console.log("Connection successful!", data);
    return true;
  } catch (err) {
    console.error("Connection error:", err);
    return false;
  }
};

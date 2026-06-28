import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://yyfzasangyvqglqiaiod.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Znphc2FuZ3l2cWdscWlhaW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzUzNTQsImV4cCI6MjA5NzY1MTM1NH0.QKd7zZ8bqE1Spm32YXhUHpewlKq3MMpdRJxfRbE7s7E";

const isReactNativeRuntime =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

const isNodeRuntime =
  !isReactNativeRuntime &&
  typeof process !== "undefined" &&
  !!(process as { versions?: { node?: string } }).versions?.node;

const realtimeOptions: { transport?: any } = {};

class NoopWebSocketTransport {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  readonly readyState = 1;
  readonly url = "";
  readonly protocol = "";

  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;

  constructor(_address: string | URL, _subprotocols?: string | string[]) {}
  close(_code?: number, _reason?: string) {}
  send(_data: string | ArrayBufferLike | Blob | ArrayBufferView) {}
  addEventListener(_type: string, _listener: EventListener) {}
  removeEventListener(_type: string, _listener: EventListener) {}
}

if (isNodeRuntime && typeof globalThis.WebSocket === "undefined") {
  try {
    const dynamicRequire =
      typeof require === "function"
        ? require
        : (Function(
            'return typeof require === "function" ? require : undefined',
          )() as ((id: string) => any) | undefined);

    const wsModule = dynamicRequire ? dynamicRequire("ws") : undefined;
    const wsTransport = wsModule?.WebSocket ?? wsModule;

    if (typeof wsTransport === "function") {
      realtimeOptions.transport = wsTransport;
    } else {
      realtimeOptions.transport = NoopWebSocketTransport;
    }
  } catch (error) {
    realtimeOptions.transport = NoopWebSocketTransport;
    console.warn(
      'Node runtime detected without WebSocket transport. Install "ws".',
      error,
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: realtimeOptions,
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
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
    console.log("Connection successful!");
    return true;
  } catch (err) {
    console.error("Connection error:", err);
    return false;
  }
};

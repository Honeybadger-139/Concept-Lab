import { Langfuse } from "langfuse";

let client = null;

export function getLangfuseClient() {
  if (client) return client;

  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) return null;

  client = new Langfuse({
    publicKey,
    secretKey,
    baseUrl: process.env.LANGFUSE_BASEURL || "https://cloud.langfuse.com",
  });

  return client;
}

export async function flushLangfuse() {
  if (!client) return;
  try {
    await client.flushAsync();
  } catch {
    // Keep telemetry failures from affecting product requests.
  }
}

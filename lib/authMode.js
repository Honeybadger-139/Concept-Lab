export function isAuthEnabled() {
  return String(process.env.CONCEPTLAB_AUTH_ENABLED || "false").toLowerCase() === "true";
}

export function getLocalFallbackUserId() {
  return String(process.env.CONCEPTLAB_LOCAL_USER_ID || "local-dev-user").trim().toLowerCase();
}

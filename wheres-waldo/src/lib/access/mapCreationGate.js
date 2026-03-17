const MAP_CREATION_ENV_FLAG = "ENABLE_MAP_CREATION_TOOLS";

export function isMapCreationEnabled() {
  const envEnabled = process.env[MAP_CREATION_ENV_FLAG] === "true";
  return process.env.NODE_ENV !== "production" || envEnabled;
}

export function shouldBlockMapCreation() {
  return !isMapCreationEnabled();
}

export function isProtectedMapCreationApiPath(pathname) {
  return pathname.startsWith("/api/image") || pathname.startsWith("/api/scores");
}

export { MAP_CREATION_ENV_FLAG };
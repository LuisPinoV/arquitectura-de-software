"use client";

interface UserProfile {
  name: string | null;
  companyName: string | null;
  spaceName: string | null;
}

export function getUserProfile(): UserProfile {
  let profile: UserProfile = {
    name: null,
    companyName: null,
    spaceName: null,
  };

  if (typeof window === "undefined") return profile;

  const idToken = localStorage.getItem("idToken");
  if (!idToken) return profile;

  function parseJwt(token: string) {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

      return JSON.parse(decodeURIComponent(escape(decoded)));
    } catch {
      return null;
    }
  }

  const claims = parseJwt(idToken);
  if (!claims) return profile;

  return {
    name:
      claims.preferred_username ||
      claims.nickname ||
      claims.name ||
      claims.email ||
      null,
    companyName: claims["custom:companyName"] || claims.companyName || null,
    spaceName: claims["custom:spaceName"] || claims.spaceName || null,
  };
}

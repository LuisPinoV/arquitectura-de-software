"use client";

import React from "react";

export function useUserProfile() {
  const [profile, setProfile] = React.useState({
    name: null,
    companyName: null,
    spaceName: null,
  });

  React.useEffect(() => {
    function parseJwt(token: string | null) {
      if (!token) return null;
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

    (async () => {
      const idToken =
        typeof window !== "undefined" ? localStorage.getItem("idToken") : null;
      const claims = parseJwt(idToken);

      // Prefer a friendly display name: preferred_username, nickname, name, email
      let name =
        claims?.preferred_username ||
        claims?.nickname ||
        claims?.name ||
        claims?.email ||
        null;
      let companyName =
        claims?.["custom:companyName"] || claims?.companyName || null;
      let spaceName = claims?.["custom:spaceName"] || claims?.spaceName || null;

      setProfile({ name, companyName, spaceName });
    })();
  }, []);

  return profile;
}

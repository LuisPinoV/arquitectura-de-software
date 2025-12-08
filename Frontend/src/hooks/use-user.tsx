"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  name: string | null;
  companyName: string | null;
  spaceName: string | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setProfile({
        name: null,
        companyName: null,
        spaceName: null,
      });
      return;
    }

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

    const name =
      claims?.preferred_username ||
      claims?.nickname ||
      claims?.name ||
      claims?.email ||
      null;

    const companyName =
      claims?.["custom:companyName"] || claims?.companyName || null;

    const spaceName =
      claims?.["custom:spaceName"] || claims?.spaceName || null;

    setProfile({ name, companyName, spaceName });
  }, []);

  return profile;
}

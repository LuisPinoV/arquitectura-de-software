"use client"

import React from "react";

export function useUserProfile() {
  const [profile, setProfile] = React.useState({ name: null, companyName: null, spaceName: null });

  React.useEffect(() => {
    function parseJwt(token: string | null) {
      if (!token) return null;
      try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeURIComponent(escape(decoded)));
      } catch {
        return null;
      }
    }

    async function fetchProfileFromApi(accessToken: string) {
      try {
        const browserUrl = (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.NEXT_PUBLIC_AUTH_USER_URL) || null;
        const url = browserUrl || process.env.NEXT_PUBLIC_AUTH_USER_URL || 'https://1u3djkukn3.execute-api.us-east-1.amazonaws.com/auth/me';
        const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        if (!res.ok) return null;
        const data = await res.json();
        // data is GetUser response; map attributes
        const attrs = data.UserAttributes ?? [];
        const out: any = {};
        attrs.forEach((a: any) => {
          out[a.Name] = a.Value;
        });
        return out;
      } catch (err) {
        return null;
      }
    }

    (async () => {
      const idToken = typeof window !== 'undefined' ? localStorage.getItem('idToken') : null;
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const claims = parseJwt(idToken);

      // Prefer a friendly display name: preferred_username, nickname, name, email
      let name = claims?.preferred_username || claims?.nickname || claims?.name || claims?.email || null;
      let companyName = claims?.['custom:companyName'] || claims?.companyName || null;
      let spaceName = claims?.['custom:spaceName'] || claims?.spaceName || null;

      if ((!companyName || !spaceName) && accessToken) {
        const apiAttrs = await fetchProfileFromApi(accessToken);
        if (apiAttrs) {
          // Prefer friendly API attributes too (preferred_username, nickname, name, email)
          name = name ?? apiAttrs['preferred_username'] ?? apiAttrs.nickname ?? apiAttrs.name ?? apiAttrs.email ?? null;
          companyName = companyName ?? apiAttrs['custom:companyName'] ?? apiAttrs.companyName ?? null;
          spaceName = spaceName ?? apiAttrs['custom:spaceName'] ?? apiAttrs.spaceName ?? null;
        }
      }

      // debug: ayuda a confirmar en la consola del navegador que recibimos los atributos
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.debug('[useUserProfile] profile fetched', { name, companyName, spaceName });
      }
      setProfile({ name, companyName, spaceName });
    })();
  }, []);

  return profile;
}

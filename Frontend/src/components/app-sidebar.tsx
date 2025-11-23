"use client"

import * as React from "react"
import {
  BookOpen,
  House,
  Search,
  NotebookPen,
} from "lucide-react"

import Image from "next/image";

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "General",
      url: "/dashboard/general",
      icon: House,
      isActive: true,
    },
    {
      title: "Búsqueda",
      url: "/dashboard/busqueda_general",
      icon: Search,
      items: [
        {
          title: "Boxes",
          url: "/dashboard/busqueda_boxes",
        },
      ],
    },
    {
      title: "Reportaje",
      url: "/dashboard/reportaje",
      icon: BookOpen,
      items: [
        {
          title: "Boxes",
          url: "/dashboard/reportaje/boxes",
        },
      ],
    },
    {
      title: "Agendamiento",
      url: "/dashboard/agendamiento",
      icon: NotebookPen,
      items: [
        {
          title: "Calendario",
          url: "/dashboard/agendamiento/calendario",
        },
        {
          title: "Peticiones",
          url: "/dashboard/agendamiento/peticiones",
        },
        {
          title: "Importar datos",
          url: "/dashboard/agendamiento/import_data",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [companyName, setCompanyName] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [spaceName, setSpaceName] = React.useState<string | null>(null);

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

    const idToken = typeof window !== 'undefined' ? localStorage.getItem('idToken') : null;
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const claims = parseJwt(idToken);
    if (claims) {
      // Prefer a friendly display name for UI (preferred_username, nickname, name, email)
      const displayNameClaim = claims['preferred_username'] || claims['nickname'] || claims.name || claims.email || null;
      // Keep a technical username as fallback (cognito:username / username)
      const usernameClaim = claims['cognito:username'] || claims['username'] || null;
      const companyClaim = claims['custom:companyName'] || claims.companyName || claims.org || claims['cognito:groups'];
      const spaceClaim = claims['custom:spaceName'] || claims.spaceName || null;

      if (displayNameClaim) setUserName(displayNameClaim);
      else if (usernameClaim) setUserName(usernameClaim);

      if (companyClaim) setCompanyName(companyClaim);
      if (spaceClaim) setSpaceName(spaceClaim);
    }

    // fallback to API /auth/me if claims missing
    if ((!companyName || !spaceName) && accessToken) {
      const browserUrl = typeof window !== 'undefined' && (window as any).__env && (window as any).__env.NEXT_PUBLIC_AUTH_USER_URL ? (window as any).__env.NEXT_PUBLIC_AUTH_USER_URL : null;
      const url = browserUrl || process.env.NEXT_PUBLIC_AUTH_USER_URL || 'https://1u3djkukn3.execute-api.us-east-1.amazonaws.com/auth/me';
      // debug: mostrar URL y token presence
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.debug('[AppSidebar] fetching profile from', url, 'hasAccessToken', !!accessToken);
      }
      fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (!data) return;
          const attrs = data.UserAttributes ?? [];
          const map: any = {};
          attrs.forEach((a: any) => (map[a.Name] = a.Value));
          // Prefer friendly API attributes first (preferred_username, nickname, name, email), fallback to data.Username
          const nameFromApi = map['preferred_username'] || map.nickname || map.name || map.email || data.Username;
          const companyFromApi = map['custom:companyName'] || map.companyName;
          const spaceFromApi = map['custom:spaceName'] || map.spaceName;
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.debug('[AppSidebar] profile from api', { nameFromApi, companyFromApi, spaceFromApi });
          }
          if (nameFromApi) setUserName(nameFromApi);
          if (companyFromApi) setCompanyName(companyFromApi);
          if (spaceFromApi) setSpaceName(spaceFromApi);
        })
        .catch(() => {});
    }

    // If we don't have useful claims, try to fetch profile from backend using accessToken
    async function fetchProfileFromApi() {
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const apiUrl = process.env.NEXT_PUBLIC_AUTH_USER_URL;
        if (!accessToken || !apiUrl) return;

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return;
        const json = await res.json();

        // AWS GetUser response contains UserAttributes array
        const attrs = json.UserAttributes || json.UserAttributes || json.Attributes || json.attributes || null;
        if (Array.isArray(attrs)) {
          const attrMap: any = {};
          attrs.forEach((a: any) => {
            const n = a.Name || a.name;
            const v = a.Value || a.value;
            if (n) attrMap[n] = v;
          });

          const nameAttr = attrMap.name || attrMap.email || attrMap.preferred_username || attrMap['cognito:username'];
          const companyAttr = attrMap['custom:companyName'] || attrMap.companyName || attrMap.org;
          if (nameAttr) setUserName(nameAttr);
          if (companyAttr) setCompanyName(companyAttr);
        } else if (json.username || json.Username) {
          if (json.username) setUserName(json.username);
          if (json.Username) setUserName(json.Username);
        }
      } catch (err) {
        // ignore fetch errors silently
      }
    }

    if (!claims || !(claims.name || claims['custom:companyName'])) {
      fetchProfileFromApi();
    }
  }, []);

  const userProp = { name: userName ?? "Usuario" };

  // build navMain replacing Boxes title with spaceName when available
  const navMain = React.useMemo(() => {
    const replacement = spaceName ?? "Boxes";
    return data.navMain.map((item) => {
      // shallow copy to preserve icon (functions cannot be JSON.stringified)
      const newItem: any = { ...item };
      if (newItem.items && newItem.items.length) {
        newItem.items = newItem.items.map((si: any) => {
          if (si.title === "Boxes") return { ...si, title: replacement };
          if (si.title === "Busqueda Boxes") return { ...si, title: `Busqueda ${replacement}` };
          return si;
        });
      }
      return newItem;
    });
  }, [spaceName]);

  // debug: show values on each render to verify UI receives updates
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[AppSidebar] render', { userName, companyName, spaceName });
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/images/bag-plus.svg" alt={"Bolsa con un más"} height={20} width={20} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-medium">{companyName ?? "AIOHospital"}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProp} />
      </SidebarFooter>
    </Sidebar>
  );
}

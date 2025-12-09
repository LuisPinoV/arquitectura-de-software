"use client";

import * as React from "react";
import {
  BookOpen,
  House,
  Search,
  NotebookPen,
  Plus,
  Calendar1,
  PersonStanding
} from "lucide-react";

import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t, language } = useLanguage();
  const [companyName, setCompanyName] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [spaceName, setSpaceName] = React.useState<string | null>(null);

  const navMainData = React.useMemo(
    () => [
      {
        title: t("nav.general"),
        url: "/dashboard/general",
        icon: House,
        isActive: true,
      },
      {
        title: t("nav.search"),
        url: "/dashboard/busqueda",
        icon: Search,
      },
      {
        title: t("nav.reports"),
        url: "/dashboard/reportaje",
        icon: BookOpen,
      },
      {
        title: t("nav.scheduling"),
        url: "/dashboard/agendamiento",
        icon: NotebookPen,
      },
      {
        title: `${t("nav.calendar")}`,
        url: "/dashboard/agendamiento/calendario",
        icon: Calendar1,
      },
      {
        title: `${t("nav.addSpace")} ${spaceName ?? t("common.space")}`,
        url: "/dashboard/nuevo-espacio",
        icon: Plus,
      },
      {
        title: `${t("nav.userCreate")}`,
        url: "/dashboard/userCreate",
        icon: PersonStanding,
      }
    ],
    [t, spaceName]
  );

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

    const idToken =
      typeof window !== "undefined" ? localStorage.getItem("idToken") : null;
    const claims = parseJwt(idToken);
    if (claims) {
      // Prefer a friendly display name for UI (preferred_username, nickname, name, email)
      const displayNameClaim =
        claims["preferred_username"] ||
        claims["nickname"] ||
        claims.name ||
        claims.email ||
        null;
      // Keep a technical username as fallback (cognito:username / username)
      const usernameClaim =
        claims["cognito:username"] || claims["username"] || "";
      const companyClaim =
        claims["custom:companyName"] ||
        claims.companyName ||
        claims.org ||
        claims["cognito:groups"] ||
        "";
      const spaceClaim = claims["custom:spaceName"] || claims.spaceName || "";

      if (displayNameClaim) setUserName(displayNameClaim);
      else if (usernameClaim) setUserName(usernameClaim);

      if (companyClaim) setCompanyName(companyClaim);
      if (spaceClaim) setSpaceName(spaceClaim);
    }
  }, []);

  const userProp = { name: userName ?? "Usuario" };

  // build navMain replacing Boxes title with spaceName when available
  const navMain = React.useMemo(() => {
    const replacement = spaceName ?? t("common.boxes");
    return navMainData.map((item) => {
      // shallow copy to preserve icon (functions cannot be JSON.stringified)
      const newItem: any = { ...item };
      if (newItem.items && newItem.items.length) {
        newItem.items = newItem.items.map((si: any) => {
          if (si.title === "Boxes") return { ...si, title: replacement };
          if (si.title === "Busqueda Boxes")
            return { ...si, title: `Busqueda ${replacement}` };
          return si;
        });
      }
      return newItem;
    });
  }, [spaceName, navMainData, t]);

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
                  <Image src="/asd.svg" alt={"ICO"} height={20} width={20} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-medium">
                    {companyName ?? "Agendín"}
                  </span>
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

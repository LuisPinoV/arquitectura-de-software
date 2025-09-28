"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/shadcn-provider";
import { useRouter } from "next/navigation";

import "./layoutDashboard.css";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    async function RefreshSession(refreshToken: string) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_REFRESH_USER_URL;
        const res = await fetch(`${apiUrl}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });

        const resJson = await res.json();

        if (res.ok) {
          console.log("Sesión mantenida correctamente");
          localStorage.setItem("idToken", resJson.idToken);
          localStorage.setItem("accessToken", resJson.accessToken);
        } else {
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("idToken");
          localStorage.removeItem("accessToken");
          router.push("/");
        }
      } catch {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        router.push("/");
      }
    }
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) RefreshSession(refreshToken);
    else router.push("/");
  }, []);

  //Gets colors
  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem("customProfiles") || "{}");
    const colors = [
      {
        name: "Color principal",
        color: "--primary",
      },
      {
        name: "Color principal texto",
        color: "--primary-foreground",
      },
      {
        name: "Color fondo",
        color: "--background",
      },
      {
        name: "Color primer plano",
        color: "--foreground",
      },
      {
        name: "Color principal cartas",
        color: "--card",
      },
      {
        name: "Color secundario cartas",
        color: "--card-foreground",
      },
      {
        name: "Color principal popovers",
        color: "--popover",
      },
      {
        name: "Color secundario popovers",
        color: "--popover-foreground",
      },
      {
        name: "Color secundario",
        color: "--secondary",
      },
      {
        name: "Color secundario texto",
        color: "--secondary-foreground",
      },
    ];

    Object.entries(profiles).forEach(([profileId, colorsProfile]) => {
      const styleTag = document.createElement("style");
      styleTag.id = `theme-${profileId}`;
      let theme = `[data-theme='${profileId}'] {\n`;

      // Here you need the same `colors` definition used when saving
      for (let i = 0; i < colors.length; i++) {
        theme += `  ${colors[i].color}: ${(colorsProfile as string[])[i]};\n`;
      }
      theme += "}\n";
      styleTag.innerHTML = theme;

      const oldTag = document.getElementById(styleTag.id);
      if (oldTag) oldTag.remove();

      document.head.appendChild(styleTag);
    });
  }, []);

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="[--header-height:calc(--spacing(14))] dashboard-layout">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar id="dashboard-sidebar" />
            <SidebarInset
              className="sidebar-inset"
              style={{ overflowY: "scroll", height: "calc(100vh - 4rem)" }}
            >
              <div className="flex flex-1 flex-col gap-4 p-4 main-dashboard">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

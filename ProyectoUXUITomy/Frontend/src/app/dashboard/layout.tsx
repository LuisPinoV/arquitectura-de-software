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
        const res = await fetch(
          `${apiUrl}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshToken }),
          }
        );

        //const resJson = await res.json();

        if (res.ok) {
          console.log("Sesión mantenida correctamente");
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
    if(refreshToken)
      RefreshSession(refreshToken);
    else
      router.push("/");
  }, []);

  return (
    <ThemeProvider
      attribute="class"
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

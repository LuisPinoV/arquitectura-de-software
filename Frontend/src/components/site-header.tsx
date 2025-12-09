"use client";

import { SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { ModeToggle } from "@/components/custom/theme-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/use-user";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiFetch } from "@/lib/apiClient";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const params = useParams();
  const { t } = useLanguage();

  const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
    "/dashboard/general": [
      { label: t("nav.dashboard"), href: "#" },
      { label: t("nav.general") },
    ],
    "/dashboard/reportaje": [
      { label: t("nav.dashboard"), href: "#" },
      { label: t("nav.general"), href: "/dashboard/general" },
      { label: t("nav.reports") },
    ],
    "/dashboard/reportaje/boxes": [
      { label: t("nav.dashboard"), href: "#" },
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.reports"), href: "/dashboard/reportaje" },
      { label: t("common.boxes") },
    ],
    "/dashboard/busqueda": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.search") },
    ],
    "/dashboard/agendamiento": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.scheduling") },
    ],
    "/dashboard/agendamiento/calendario": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.scheduling"), href: "/dashboard/agendamiento" },
      { label: t("nav.calendar") },
    ],
    "/dashboard/agendamiento/import_data": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.scheduling"), href: "/dashboard/agendamiento" },
      { label: t("nav.importData") },
    ],
    "/dashboard/account-settings": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("settings.title") },
    ],
    "/dashboard/account-settings/themes": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("settings.title"), href: "/dashboard/account-settings" },
      { label: t("common.themes") },
    ],
    "/dashboard/account-settings/general": [
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("settings.title"), href: "/dashboard/account-settings" },
      { label: t("common.general") },
    ],
  };

  const items = breadcrumbMap[pathname] || [];

  // Use centralized hook so header updates when profile is fetched
  const profile = useUserProfile() as any;
  const spaceName = profile?.spaceName ?? null;
  const displaySpace = spaceName ?? "Espacio";

  const [curSpaceName, setCurSpaceName] = useState<string>("");

  useEffect(() => {
    if (pathname.startsWith("/dashboard/reportaje") && params?.box) {
      async function fetchSpaceName() {
        try {
          const res = await apiFetch(`/api/scheduling/get_boxes`);
          const data: any = await res?.json();
          if (Array.isArray(data)) {
            const curSpace = data.find((s) => s.idBox === params.box);
            setCurSpaceName(curSpace.nombre ? curSpace.nombre : "N/A");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      fetchSpaceName();
    }
  }, [pathname, params?.box]);

  if (pathname.startsWith("/dashboard/reportaje") && params?.box) {
    items.push(
      { label: t("common.home"), href: "#" },
      { label: t("nav.dashboard"), href: "/dashboard/general" },
      { label: t("nav.reports"), href: "/dashboard/reportaje" },
      { label: `${displaySpace} - ${curSpaceName}` }
    );
  }

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:flex w-full justify-between">
          <BreadcrumbList>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {/* replace static 'Boxes' occurrences */}
                      {item.label === "Boxes"
                        ? displaySpace
                        : item.label?.startsWith("Busqueda Boxes")
                        ? item.label.replace("Boxes", displaySpace)
                        : item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>
                      {item.label === "Boxes"
                        ? displaySpace
                        : item.label?.startsWith("Busqueda Boxes")
                        ? item.label.replace("Boxes", displaySpace)
                        : item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div
          style={{ display: "flex", justifyContent: "right", flex: "1 1 50%" }}
        >
          <div className="me-2">
            <ModeToggle />
          </div>
          <div style={{ flex: "1 1 100%", maxWidth: "300px" }}>
            <SearchForm />
          </div>
        </div>
      </div>
    </header>
  );
}

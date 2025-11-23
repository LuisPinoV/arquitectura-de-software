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
import React from "react";
import { useUserProfile } from '@/hooks/use-user';

const breadcrumbMap: Record<string, { label: string; href?: string }[]> = {
  "/": [{ label: "Inicio" }],
  "/dashboard/general": [{ label: "Inicio", href: "/" }, { label: "General" }],
  "/dashboard/reportaje": [
    { label: "Inicio", href: "/" },
    { label: "General", href: "/dashboard/general" },
    { label: "Reportaje" },
  ],
  "/dashboard/reportaje/boxes": [
    { label: "Inicio", href: "/" },
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Reportaje", href: "/dashboard/reportaje" },
    { label: "Boxes" },
  ],
  "/dashboard/reportaje/personal": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Reportaje", href: "/dashboard/reportaje" },
    { label: "Personal" },
  ],
  "/dashboard/busqueda_general": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Busqueda General" },
  ],
  "/dashboard/busqueda_boxes": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Busqueda Boxes" },
  ],
  "/dashboard/busqueda_medicos": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Busqueda Funcionarios" },
  ],
  "/dashboard/agendamiento": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Agendamiento" },
  ],
  "/dashboard/agendamiento/calendario": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Agendamiento", href: "/dashboard/agendamiento" },
    { label: "Calendario" },
  ],
  "/dashboard/agendamiento/import_data": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Agendamiento", href: "/dashboard/agendamiento" },
    { label: "Importar datos" },
  ],
  "/dashboard/account-settings": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Cuenta", href: "/dashboard/general" },
    { label: "Configuración" },
  ],
  "/dashboard/account-settings/themes": [
    { label: "Dashboard", href: "/dashboard/general" },
    { label: "Cuenta", href: "/dashboard/general" },
    { label: "Configuración", href:"/dashboard/account-settings" },
    { label: "Temas"}
  ],
};

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const params = useParams();
  const items = breadcrumbMap[pathname] || [];

  // Use centralized hook so header updates when profile is fetched
  const profile = useUserProfile() as any;
  const spaceName = profile?.spaceName ?? null;
  const displaySpace = spaceName ?? 'Boxes';

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[SiteHeader] spaceName', spaceName);
  }

  if (pathname.startsWith("/dashboard/reportaje/boxes/") && params?.box) {
    items.push(
      { label: "Inicio", href: "/" },
      { label: "Dashboard", href: "/dashboard/general" },
      { label: "Reportaje", href: "/dashboard/reportaje" },
      { label: displaySpace, href: "/dashboard/reportaje/boxes"  },
      { label: `${displaySpace} - ${params.box}` }
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
                        {item.label === 'Boxes'
                          ? displaySpace
                          : item.label?.startsWith('Busqueda Boxes')
                          ? item.label.replace('Boxes', displaySpace)
                          : item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        {item.label === 'Boxes'
                          ? displaySpace
                          : item.label?.startsWith('Busqueda Boxes')
                          ? item.label.replace('Boxes', displaySpace)
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

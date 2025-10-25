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
  user: {
    name: "Juana Pato",
  },
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
                  <Image src="/images/bag-plus.svg" alt ={"Bolsa con un más"} height ={20} width={20}/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-medium">AIOHospital</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

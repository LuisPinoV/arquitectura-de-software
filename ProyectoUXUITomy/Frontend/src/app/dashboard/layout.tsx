import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/shadcn-provider";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import "./layoutDashboard.css";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;
  console.log(accessToken);

  if (!accessToken) {
    redirect('/');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="[--header-height:calc(--spacing(14))] dashboard-layout">
        <SidebarProvider className="flex flex-col">
          <SiteHeader/>
          <div className="flex flex-1">
            <AppSidebar id="dashboard-sidebar" />
            <SidebarInset className = "sidebar-inset" style = {{overflowY:"scroll", height:"calc(100vh - 4rem)"}}>
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

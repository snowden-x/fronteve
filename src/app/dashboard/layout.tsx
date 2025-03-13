"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will handle authentication and role-based access
  useAuthGuard();

  return (
    <SidebarProvider>
      <AppSidebar />
        <div className="flex flex-1 flex-col p-4">
          <SidebarInset>
          <SiteHeader />
            {children}
          </SidebarInset>    
        </div>
    </SidebarProvider>
  );
}

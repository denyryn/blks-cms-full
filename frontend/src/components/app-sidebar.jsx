import * as React from "react";
import { Link } from "react-router";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconRobot,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import config from "@/lib/config";
import { ChartColumnStacked, LibraryBig, Mail, Receipt } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/home",
      icon: IconDashboard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  dataManagements: [
    {
      name: "Category",
      url: "/dashboard/category",
      icon: ChartColumnStacked,
    },
    {
      name: "Products",
      url: "/dashboard/product",
      icon: LibraryBig,
    },
    {
      name: "Orders",
      url: "/dashboard/order",
      icon: Receipt,
    },
    {
      name: "Guest Messages",
      url: "/dashboard/guest-message",
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user, loading, logout } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard">
                <IconRobot className="!size-5" />
                <span className="text-base font-semibold">
                  {config.appName}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.dataManagements} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} loading={loading} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}

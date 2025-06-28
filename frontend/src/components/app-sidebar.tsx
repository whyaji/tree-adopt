'use client';

import { Link } from '@tanstack/react-router';
import { ArrowUpCircleIcon, LucideIcon } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ROLE } from '@/enum/role.enum';
import { useUserStore } from '@/lib/stores/userStore';

import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';

export function AppSidebar({
  navItem,
  navSecondary,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navItem: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      hide?: boolean;
    }[];
  }[];
  navSecondary?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const user = useUserStore((state) => state.user);

  const homeUrl = user?.role === ROLE.ADMIN ? '/admin' : '/';

  const { setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={homeUrl}>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Tree Adopt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto scrollbar-hidden">
        <NavMain items={navItem} closeMobileSidebar={closeMobileSidebar} />
        {navSecondary !== undefined && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>
    </Sidebar>
  );
}

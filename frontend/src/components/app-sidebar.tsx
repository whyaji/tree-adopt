'use client';

import { ArrowUpCircleIcon, LucideIcon } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
    }[];
  }[];
  navSecondary?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Tree Adopt</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto scrollbar-hidden">
        <NavMain items={navItem} />
        {navSecondary !== undefined && <NavSecondary items={navSecondary} className="mt-auto" />}
      </SidebarContent>
    </Sidebar>
  );
}

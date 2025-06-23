'use client';

import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function NavMain({
  items,
}: {
  items: {
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
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline">
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item) =>
            item.items != undefined ? (
              <Collapsible key={item.title} asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    asChild
                    onClick={() => {
                      if (item.url) {
                        window.location.href = item.url;
                      }
                    }}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(
                        (subItem) =>
                          !subItem.hide && (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={(pathname + '/').includes(subItem.url + '/')}>
                                <button
                                  type="button"
                                  onClick={() => navigate({ to: subItem.url })}
                                  className="w-full text-left"
                                  tabIndex={0}>
                                  <span>{subItem.title}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.url === pathname}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: item.url })}
                    className="flex items-center gap-2 w-full text-left">
                    {item.icon && <item.icon />}
                    {item.title}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

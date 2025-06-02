import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import {
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { UserType } from '@/types/user.type';

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const stringUser = Cookies.get('user');
  const user: UserType = stringUser ? JSON.parse(stringUser) : null;

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex-1">
        <Breadcrumb className="w-full">
          <BreadcrumbList className="flex items-center gap-2">
            <BreadcrumbItem>
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="flex items-center">
                <HomeIcon className="mr-1" />
              </button>
              {pathSegments.length > 0 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const href = '/' + pathSegments.slice(0, index + 1).join('/');
              const formattedSegment = segment
                .replace(/-/g, ' ')
                .replace(/%20/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <BreadcrumbItem key={href}>
                  {!isLast ? (
                    <>
                      <button type="button" onClick={() => navigate({ to: href })}>
                        {formattedSegment}
                      </button>
                      <BreadcrumbSeparator />
                    </>
                  ) : (
                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Avatar Account */}
      {user && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={'bottom'}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar ?? '/avatars/shadcn.jpg'} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/profile" className="w-full">
                  <DropdownMenuItem>
                    <UserCircleIcon />
                    Account
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}

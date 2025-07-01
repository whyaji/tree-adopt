import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
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
import { ROLE } from '@/enum/role.enum';
import { useUserStore } from '@/lib/stores/userStore';

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const homeUrl = user?.role === ROLE.ADMIN ? '/admin' : '/';
  const profileUrl = user?.role === ROLE.ADMIN ? '/admin/profile' : '/profile';

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
        <Breadcrumb className="w-full">
          <BreadcrumbList className="flex items-center gap-2 text-xs sm:text-sm">
            {/* Show all segments on sm+ */}
            <div className="hidden sm:flex items-center gap-2">
              <BreadcrumbItem>
                <button
                  type="button"
                  onClick={() => navigate({ to: homeUrl })}
                  className="flex items-center">
                  <HomeIcon className="mr-1" size={20} />
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
            </div>
            {/* Show only last segment on mobile */}
            <div className="flex sm:hidden items-center gap-2">
              {pathSegments.length > 0 && (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {pathSegments[pathSegments.length - 1]
                      .replace(/-/g, ' ')
                      .replace(/%20/g, ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </div>
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
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-2 sm:px-3">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name ? user.name[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Hide name/email on mobile, show on sm+ */}
                <div className="hidden sm:grid flex-1 text-left text-sm leading-tight ml-2">
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
                    <AvatarFallback className="rounded-lg">
                      {user.name ? user.name[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={profileUrl} className="w-full">
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

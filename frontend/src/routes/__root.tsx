import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import {
  Database,
  HomeIcon,
  Info,
  LogOut,
  LucideIcon,
  Map,
  MoreHorizontal,
  SettingsIcon,
  Users,
} from 'lucide-react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { PERMISSION } from '@/enum/permission.enum';
import { ROLE } from '@/enum/role.enum';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';

const Root = () => {
  const user = useUserStore((state) => state.user);
  const permissions = user?.permissions ?? [];

  const navMain: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[] = [
    {
      title: 'Beranda',
      icon: HomeIcon,
      url: '/',
    },
    {
      title: 'Tentang Kami',
      icon: Info,
      items: [
        { title: 'Apa itu Adopsi Pohon', url: '/tentang-kami/apa-itu-adopsi-pohon' },
        { title: 'Kelompok komunitas', url: '/tentang-kami/kelompok-komunitas' },
        { title: 'Laporan-laporan', url: '/tentang-kami/laporan-laporan' },
      ],
    },
    {
      title: 'Program Kami',
      icon: Users,
      url: '/program-kami',
      items: [
        { title: 'Adopsi Pohon', url: '/program-kami/adopsi-pohon' },
        { title: 'Pemberdayaan Masyarakat', url: '/program-kami/pemberdayaan-masyarakat' },
        { title: 'Patroli & Geo-Tagging', url: '/program-kami/patroli-&-geo-tagging' },
        { title: 'Monitor Biodiversity', url: '/program-kami/monitor-biodiversity' },
      ],
    },
    {
      title: 'Data',
      icon: Database,
      items: [
        { title: 'Pohon', url: '/data/pohon' },
        { title: 'Adopter', url: '/data/adopter' },
      ],
    },
    {
      title: 'Pemetaan',
      icon: Map,
      url: '/pemetaan',
    },
    {
      title: 'Lain-lain',
      icon: MoreHorizontal,
      items: [
        { title: 'FAQ', url: '/lain/faq' },
        { title: 'Kontak Kami', url: '/lain/kontak' },
      ],
    },
  ];

  const navSecondary = [
    {
      title: 'Logout',
      url: '/profile',
      icon: LogOut,
    },
  ];

  const navMainAdmin: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      hide?: boolean;
    }[];
  }[] = [
    {
      title: 'Dashboard',
      icon: HomeIcon,
      url: '/admin',
    },
    {
      title: 'Konfigurasi',
      icon: SettingsIcon,
      items: [
        {
          title: 'User',
          url: '/admin/config/user',
          hide: !permissions.includes(PERMISSION.USER_MANAGEMENT_VIEW),
        },
        {
          title: 'Role Permission',
          url: '/admin/config/role-permission',
          hide: !permissions.includes(PERMISSION.ROLE_PERMISSION_MANAGEMENT_VIEW),
        },
      ],
    },
    {
      title: 'Master',
      icon: Database,
      items: [{ title: 'Pohon', url: '/admin/master/pohon' }],
    },
    {
      title: 'Tentang Kami',
      icon: Info,
      items: [
        { title: 'Apa itu Adopsi Pohon', url: '/admin/tentang-kami/apa-itu-adopsi-pohon' },
        {
          title: 'Kelompok komunitas',
          url: '/admin/tentang-kami/kelompok-komunitas',
          hide: !checkPermission(permissions, [
            PERMISSION.COMUNITY_GROUP_VIEW_LEVEL_GLOBAL,
            PERMISSION.COMUNITY_GROUP_VIEW_LEVEL_GROUP,
          ]),
        },
        { title: 'Laporan-laporan', url: '/admin/tentang-kami/laporan-laporan' },
      ],
    },
    {
      title: 'Data',
      icon: Database,
      items: [
        {
          title: 'Pohon',
          url: '/admin/data/pohon',
          hide: !permissions.includes(PERMISSION.TREE_VIEW),
        },
      ],
    },
  ];

  const navSecondaryAdmin = [
    {
      title: 'Logout',
      url: '/admin/profile',
      icon: LogOut,
    },
  ];
  return (
    <SidebarProvider>
      {user?.role === ROLE.ADMIN && (
        <AppSidebar navItem={navMainAdmin} navSecondary={navSecondaryAdmin} />
      )}
      {user?.role === ROLE.USER && <AppSidebar navItem={navMain} navSecondary={navSecondary} />}
      <SidebarInset>
        {user && (
          <div className="sticky top-0 z-10 bg-background">
            <SiteHeader />
          </div>
        )}
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
          {/* <TanStackRouterDevtools /> */}
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

interface MyRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: Root,
});

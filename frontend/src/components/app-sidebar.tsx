'use client';

import {
  ArrowUpCircleIcon,
  CameraIcon,
  ClipboardListIcon,
  Database,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HomeIcon,
  Info,
  LogOut,
  LucideIcon,
  Map,
  MoreHorizontal,
  Users,
} from 'lucide-react';
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
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navClouds: [
    {
      title: 'Capture',
      icon: CameraIcon,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
          isActive: false,
        },
        {
          title: 'Archived',
          url: '#',
          isActive: false,
        },
      ],
    },
    {
      title: 'Proposal',
      icon: FileTextIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: FileCodeIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Logout',
      url: '/profile',
      icon: LogOut,
    },
    // {
    //   title: 'Get Help',
    //   url: '#',
    //   icon: HelpCircleIcon,
    // },
    // {
    //   title: 'Search',
    //   url: '#',
    //   icon: SearchIcon,
    // },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: DatabaseIcon,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardListIcon,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: FileIcon,
    },
  ],
};

const navMain: {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={navMain} />
        {/* <NavMenu items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}

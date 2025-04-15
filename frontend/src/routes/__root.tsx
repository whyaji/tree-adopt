import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

// const Root = () => (
//   <div className="flex h-screen">
//     <NavDrawer />
//     <div className="flex-1 p-4 overflow-auto">
//       <Outlet />
//       {/* <TanStackRouterDevtools /> */}
//       <Toaster />
//     </div>
//   </div>
// );

const Root = () => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <div className="sticky top-0 z-10 bg-background">
        <SiteHeader />
      </div>
      {/* <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div> */}
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
        <Toaster />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

interface MyRouteContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: Root,
});

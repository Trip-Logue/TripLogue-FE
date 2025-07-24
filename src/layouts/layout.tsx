import { MainSidebar } from '@/assets/pages/mainSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { LayoutProps } from '@/types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Layout({ children, outerClassName, sidebarClassName }: LayoutProps) {
  return (
    <div className={cn('flex', outerClassName)}>
      <div className={cn('flex flex-col gap-4 bg-white', sidebarClassName)}>
        <SidebarProvider>
          <MainSidebar />
        </SidebarProvider>
      </div>
      {children}
    </div>
  );
}

export default Layout;

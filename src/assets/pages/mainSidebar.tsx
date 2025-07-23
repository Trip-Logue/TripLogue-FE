import { Image, Home, CircleUserRound, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useSidebar } from '@/components/ui/sidebar';

const items = [
  {
    title: '홈으로',
    url: '/',
    icon: Home,
  },
  {
    title: '사진 모아보기',
    url: 'photogallery',
    icon: Image,
  },
  {
    title: '마이페이지',
    url: '/mypage',
    icon: CircleUserRound,
  },
  {
    title: '나의 친구',
    url: 'myfriend',
    icon: Users,
  },
];

export function MainSidebar() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible='icon'>
      <div className='flex justify-end p-2 border-b border-border'>
        <button
          aria-label={state === 'expanded' ? '사이드바 접기' : '사이드바 펼치기'}
          onClick={toggleSidebar}
          className='p-1 rounded hover:bg-accent'>
          {state === 'expanded' ? (
            <ChevronLeft className='w-5 h-5' />
          ) : (
            <ChevronRight className='w-5 h-5' />
          )}
        </button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className='flex items-center gap-2'>
                      <item.icon className='w-5 h-5' />
                      {state === 'expanded' && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LogOut,
  Home,
  CircleUserRound,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
} from 'lucide-react';
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
import { logoutUser } from '@/api/service/authService';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function MainSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state !== 'expanded';
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('로그아웃 되었습니다.');
      navigate('/login');
    } catch {
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const menuItems = [
    { title: '홈으로', url: '/', icon: Home, color: 'text-blue-600' },
    { title: '사진 모아보기', url: '/photogallery', icon: Camera, color: 'text-purple-600' },
    { title: '마이페이지', url: '/mypage', icon: CircleUserRound, color: 'text-green-600' },
    { title: '나의 친구', url: '/friends', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <TooltipProvider>
      <Sidebar
        collapsible='icon'
        className='bg-gradient-to-b from-blue-50 to-indigo-100 border-r border-blue-200'>
        {/* Header with gradient */}
        <div
          className={`relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b border-blue-500 ${
            isCollapsed ? 'px-2 py-3' : 'p-4'
          }`}>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='relative z-10 flex items-center gap-3 h-8'>
            {!isCollapsed && (
              <>
                <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                  <MapPin className='text-white' size={20} />
                </div>
                <span className='text-white font-bold text-lg'>TripLogue</span>
              </>
            )}
          </div>

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-lg transition-colors duration-200 ${
              isCollapsed
                ? 'left-1/2 -translate-x-1/2 p-1.5 hover:bg-white/10'
                : 'right-4 p-2 hover:bg-white/20'
            }`}
            aria-label={state === 'expanded' ? '사이드바 접기' : '사이드바 펼치기'}>
            {state === 'expanded' ? (
              <ChevronLeft className='w-4 h-4 text-white' />
            ) : (
              <ChevronRight className='w-4 h-4 text-white' />
            )}
          </button>

          <div className='absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl'></div>
        </div>

        <SidebarContent className={isCollapsed ? 'px-1 py-3' : 'p-4'}>
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className='text-blue-800 font-semibold text-sm uppercase tracking-wider mb-3 px-2'>
                메뉴
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className='space-y-2'>
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={`${
                              isCollapsed ? 'px-0 justify-center' : 'w-full hover:bg-white/60'
                            } rounded-xl transition-all duration-200 hover:shadow-md overflow-visible`}>
                            <Link to={item.url} className='w-full min-w-0'>
                              <div
                                className={`flex items-center ${
                                  isCollapsed ? 'justify-center' : 'gap-3 w-full'
                                }`}>
                                <div
                                  className={`flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm ${
                                    item.color
                                  } ${isCollapsed ? 'w-8 h-8' : 'p-2'}`}>
                                  <Icon className='w-4 h-4 shrink-0' />
                                </div>
                                {!isCollapsed && (
                                  <span className='font-medium text-gray-700 truncate'>
                                    {item.title}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side='right' className='bg-gray-800 text-white'>
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}

                {/* Separator */}
                <hr className='my-4 border-blue-200/50' />

                {/* Logout Button */}
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={handleLogout}
                        className={`${
                          isCollapsed ? 'px-0 justify-center' : 'w-full hover:bg-white/60'
                        } rounded-xl transition-all duration-200 hover:shadow-md`}>
                        <div
                          className={`flex items-center ${
                            isCollapsed ? 'justify-center' : 'gap-3 w-full'
                          }`}>
                          <div className='flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm text-red-600 w-8 h-8'>
                            <LogOut className='w-4 h-4 shrink-0' />
                          </div>
                          {!isCollapsed && (
                            <span className='font-medium text-gray-700 truncate'>로그아웃</span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side='right' className='bg-gray-800 text-white'>
                        로그아웃
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}

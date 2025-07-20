import { MainSidebar } from "./mainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainMap from "@/components/map/mainMap";
import CommonBtn from '@/components/commons/commonBtn';
import { useRoute } from '@/hooks/useRoute';

function MainPage() {
  const { routeToLogin, routeToSignup } = useRoute();

  return (
    <>
      <div className='flex'>
        <div className='flex flex-col gap-4 bg-white-100'>
          <SidebarProvider>
            <MainSidebar />
          </SidebarProvider>
        </div>
        <MainMap />
        <div className='flex-1 flex justify-end p-4 gap-2'>
          <CommonBtn
            onClick={routeToLogin}
            text='로그인'
            className='bg-[#D9D9D9] text-[#1A1A1A] border border-transparent rounded-lg px-4 py-2 font-medium text-base hover:bg-[#C0C0C0] transition-colors duration-200 w-24 h-10'></CommonBtn>
          <CommonBtn
            onClick={routeToSignup}
            text='회원가입'
            className='bg-[#D9D9D9] text-[#1A1A1A] border border-transparent rounded-lg px-4 py-2 font-medium text-base hover:bg-[#C0C0C0] transition-colors duration-200 w-28 h-10'></CommonBtn>
        </div>
      </div>
    </>
  );
}

export default MainPage;

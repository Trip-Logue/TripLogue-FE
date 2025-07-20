import { MainSidebar } from "./mainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainMap from "@/components/map/mainMap";

function MainPage() {
  return (
    <div className="flex flex-col gap-4 bg-white-100">
      <SidebarProvider >
        <MainSidebar />
        <MainMap/>
      </SidebarProvider>

    </div>
  );
}

export default MainPage;

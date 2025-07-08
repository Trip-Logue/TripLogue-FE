import { MainSidebar } from "./mainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function MainPage() {
  return (
    <div className="flex flex-col gap-4 bg-white-100">
      <SidebarProvider >
        <MainSidebar />
      </SidebarProvider>
    </div>
  );
}

export default MainPage;

import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom"; // Importamos o Outlet para renderizar as rotas filhas

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 sticky top-0 z-10">
            <SidebarTrigger className="text-slate-500 hover:bg-slate-100" />
            <div className="ml-4 h-4 w-[1px] bg-slate-200" />
            <span className="ml-4 text-sm font-medium text-slate-500">Sistema de Gestão à Vida</span>
          </header>
          <div className="p-8">
            {/* O Outlet substitui o {children} e renderiza a página da rota atual */}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
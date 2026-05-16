import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

// PARA A EQUIPE: Este é o "molde" que engloba o sistema. A barra lateral (Sidebar) fica fixa.
// O componente <Outlet /> atua como um "buraco", onde o React Router injeta dinamicamente 
// a página atual (ex: Index, Usuarios) dependendo da URL que o usuário acessa.
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
            {/* O conteúdo da página aparece aqui dentro */}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
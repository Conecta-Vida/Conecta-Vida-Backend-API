import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Megaphone, 
  AlertTriangle, 
  LogOut,
  HeartPulse
} from "lucide-react";

export default function AppLayout() {
  const location = useLocation();

  // Limpa a sessão do administrador ao sair
  const handleLogout = () => {
    localStorage.removeItem("@conecta:admin");
    window.location.href = "/login";
  };

  // Menu Lateral atualizado (Sem Configurações)
  const menuItens = [
    { caminho: "/", label: "Dashboard", icone: LayoutDashboard },
    { caminho: "/usuarios", label: "Usuários", icone: Users },
    { caminho: "/instituicoes", label: "Unidades de Saúde", icone: Building2 },
    { caminho: "/campanhas", label: "Campanhas", icone: Megaphone },
    { caminho: "/alertas", label: "Gestão de Alertas", icone: AlertTriangle },
  ];

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        
        {/* LOGO */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6 bg-blue-600 text-white">
          <HeartPulse className="h-6 w-6 text-white animate-pulse" />
          <span className="text-lg font-black tracking-tight">Conecta Admin</span>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          {menuItens.map((item) => {
            const Icone = item.icone;
            const itemAtivo = location.pathname === item.caminho;

            return (
              <Link
                key={item.caminho}
                to={item.caminho}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                  itemAtivo
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icone className={`h-4 w-4 shrink-0 ${itemAtivo ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RODAPÉ DO MENU */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 shrink-0 text-red-500" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 pl-64">
        <header className="h-16 bg-white border-b border-slate-200/60 sticky top-0 z-10 flex items-center justify-end px-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modo Administrador</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
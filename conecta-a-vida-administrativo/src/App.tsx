import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; 
import AppLayout from "./components/AppLayout";
import { Loader2 } from "lucide-react"; // Ícone de carregamento

// OTIMIZAÇÃO: Lazy Loading (Code Splitting)
// O Vite vai separar cada página num arquivo .js diferente e só carregará quando necessário.
const Index = lazy(() => import("./pages/Index"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Campanhas = lazy(() => import("./pages/Campanhas"));
const CampanhaDetalhes = lazy(() => import("./pages/CampanhaDetalhes"));
const Alertas = lazy(() => import("./pages/Alertas"));
const AlertaUrgente = lazy(() => import("./pages/AlertaUrgente"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));

// Componente visual enquanto a página está a ser descarregada
const TelaCarregamento = () => (
  <div className="flex h-[70vh] w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div className="p-10 font-bold">Página de Login (Em Construção)</div>} />

        <Route element={<AppLayout />}>
          {/* O Suspense envolve as rotas para exibir o Loader enquanto a página é importada */}
          <Route path="/" element={<Suspense fallback={<TelaCarregamento />}><Index /></Suspense>} />
          <Route path="/usuarios" element={<Suspense fallback={<TelaCarregamento />}><Usuarios /></Suspense>} /> 
          <Route path="/campanhas" element={<Suspense fallback={<TelaCarregamento />}><Campanhas /></Suspense>} />
          <Route path="/campanhas/:id" element={<Suspense fallback={<TelaCarregamento />}><CampanhaDetalhes /></Suspense>} />
          <Route path="/alertas" element={<Suspense fallback={<TelaCarregamento />}><Alertas /></Suspense>} />
          <Route path="/alerta-urgente" element={<Suspense fallback={<TelaCarregamento />}><AlertaUrgente /></Suspense>} />
          <Route path="/configuracoes" element={<Suspense fallback={<TelaCarregamento />}><Configuracoes /></Suspense>} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors /> 
    </BrowserRouter>
  );
}
export default App;
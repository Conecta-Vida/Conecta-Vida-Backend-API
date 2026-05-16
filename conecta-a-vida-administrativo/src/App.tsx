import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; 
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Usuarios from "./pages/Usuarios"; // Página de Utilizadores que substituiu Pacientes
import Campanhas from "./pages/Campanhas";
import CampanhaDetalhes from "./pages/CampanhaDetalhes";
import Alertas from "./pages/Alertas";
import AlertaUrgente from "./pages/AlertaUrgente";
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/usuarios" element={<Usuarios />} /> {/* Rota de Utilizadores */}
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/campanhas/:id" element={<CampanhaDetalhes />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/alerta-urgente" element={<AlertaUrgente />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors /> 
    </BrowserRouter>
  );
}
export default App;
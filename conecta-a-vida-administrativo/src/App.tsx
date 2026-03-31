import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; // Adicione esta linha
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Pacientes from "./pages/Pacientes";
import Campanhas from "./pages/Campanhas";
import CampanhaDetalhes from "./pages/CampanhaDetalhes";
import Alertas from "./pages/Alertas";
import AlertaUrgente from "./pages/AlertaUrgente";
import Configuracoes from "./pages/Configuracoes";
import CarteiraAdmin from "./pages/CarteiraAdmin";
import CarteiraVacinacao from "./pages/CarteiraVacinacao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/campanhas/:id" element={<CampanhaDetalhes />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/alerta-urgente" element={<AlertaUrgente />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/carteira" element={<CarteiraAdmin />} />
          {/* Nova Rota Adicionada */}
          <Route path="/carteira-vacinacao" element={<CarteiraVacinacao />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors /> {/* Adicione esta linha aqui fora das rotas */}
    </BrowserRouter>
  );
}
export default App;
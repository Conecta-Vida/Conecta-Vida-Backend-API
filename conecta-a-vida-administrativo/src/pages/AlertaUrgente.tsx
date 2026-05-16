import { AlertTriangle, ShieldAlert, Users, MapPin, Activity, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// PARA A EQUIPE: Esta tela atualmente serve como um "Template Visual Estático" projetado 
// no protótipo, usado em momentos de crise. Ainda não possui conexão com a API.
export default function AlertaUrgente() {
  return (
    <div className="space-y-8 pb-10">
      <div className="bg-red-600 rounded-2xl p-8 text-white shadow-xl shadow-red-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 bg-red-700/50 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" /> Plantão de Emergência
          </div>
          <h1 className="text-4xl font-black tracking-tighter">ALERTA DE SURTO: DENGUE TIPO 4</h1>
          <p className="text-red-100 font-medium max-w-xl text-lg">
            Aumento atípico de casos registrados na região de Bragança Paulista. Protocolo de contingência nível 2 ativado.
          </p>
        </div>
        <ShieldAlert className="w-48 h-48 text-red-500/30 absolute -right-10 -bottom-10" />
        <Button className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 h-12 relative z-10">
          Ver Protocolo Completo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Casos Confirmados</CardTitle></CardHeader><CardContent><div className="text-3xl font-black text-red-600">142</div></CardContent></Card>
        <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Em Investigação</CardTitle></CardHeader><CardContent><div className="text-3xl font-black text-amber-600">87</div></CardContent></Card>
        <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-slate-500 uppercase">Área de Foco</CardTitle></CardHeader><CardContent><div className="text-xl font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Bragança Paulista</div></CardContent></Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-900 text-white">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Orientações para Profissionais de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><h3 className="font-bold text-slate-900 mb-2">1. Triagem Prioritária</h3><p className="text-sm text-slate-600">Pacientes com febre alta e dor retro-orbital devem ser encaminhados imediatamente para o setor amarelo.</p></div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><h3 className="font-bold text-slate-900 mb-2">2. Notificação Compulsória</h3><p className="text-sm text-slate-600">Todos os casos suspeitos devem ser registrados no sistema Conecta à Vida em menos de 1 hora.</p></div>
          </div>
          <Link to="/alertas"><Button variant="ghost" className="mt-4 text-slate-500 hover:text-slate-900"><ChevronLeft className="w-4 h-4 mr-2" /> Voltar para Central de Alertas</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
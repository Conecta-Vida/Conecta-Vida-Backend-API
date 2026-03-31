import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, BellRing, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Alerta, alertaService } from "../services/api";
import { toast } from "sonner";

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarAlertas = async () => {
    try {
      const dados = await alertaService.listarTodos();
      setAlertas(dados);
    } catch (error) {
      toast.error("Não foi possível carregar os alertas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarAlertas(); }, []);

  const handleMarcarLido = async (id: number) => {
    try {
      await alertaService.marcarComoLido(id);
      setAlertas(prev => prev.filter(a => a.id !== id));
      toast.success("Alerta arquivado.");
    } catch (error) {
      toast.error("Erro ao atualizar alerta.");
    }
  };

  const getEstiloAlerta = (tipo: string) => {
    switch (tipo) {
      case "urgente": return {
        icone: <AlertTriangle className="w-6 h-6 text-red-600" />,
        cor: "border-red-200 bg-red-50",
        texto: "text-red-900"
      };
      case "aviso": return {
        icone: <AlertCircle className="w-6 h-6 text-amber-600" />,
        cor: "border-amber-200 bg-amber-50",
        texto: "text-amber-900"
      };
      default: return {
        icone: <Info className="w-6 h-6 text-blue-600" />,
        cor: "border-blue-200 bg-blue-50",
        texto: "text-blue-900"
      };
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Central de Alertas</h1>
            {alertas.length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {alertas.length} Novo(s)
              </span>
            )}
          </div>
          <p className="text-slate-500">Monitorização de stock e notificações do sistema.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
        ) : alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <BellRing className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Sem alertas pendentes</h3>
            <p className="text-slate-500 mt-1">Tudo está a funcionar normalmente.</p>
          </div>
        ) : (
          alertas.map((alerta) => {
            const estilo = getEstiloAlerta(alerta.tipo);
            return (
              <Card key={alerta.id} className={`border ${estilo.cor} shadow-sm transition-all hover:shadow-md`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                      {estilo.icone}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className={`font-bold text-lg ${estilo.texto}`}>{alerta.titulo}</h3>
                        <span className="text-xs text-slate-400 bg-white/50 px-2 py-1 rounded">
                          {new Date(alerta.dataCriacao).toLocaleString('pt-PT')}
                        </span>
                      </div>
                      <p className={`${estilo.texto} opacity-80 mt-1`}>{alerta.descricao}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="bg-white/50 hover:bg-white text-slate-700"
                      onClick={() => alerta.id && handleMarcarLido(alerta.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Lido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
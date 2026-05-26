import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, BellRing, Loader2, Plus, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Alerta, alertaService } from "../services/api";
import { toast } from "sonner";

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCadastro, setOpenCadastro] = useState(false); // Controla modal de novo alerta

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

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const novoAlerta: Alerta = {
      tipo: "ALERTA",
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      localizacao: formData.get("localizacao") as string,
      dataPostada: new Date().toISOString(),
      lido: false
    };

    try {
      await alertaService.cadastrar(novoAlerta);
      toast.success("Alerta geral emitido com sucesso!");
      setOpenCadastro(false);
      carregarAlertas(); // Atualiza a lista da tela
    } catch (error) {
      toast.error("Erro ao emitir alerta no sistema.");
    }
  };

  const getEstiloAlerta = (categoria: string | undefined) => {
    switch (categoria?.toLowerCase()) {
      case "urgente": 
        return { icone: <AlertTriangle className="w-6 h-6 text-red-600" />, cor: "border-red-200 bg-red-50", texto: "text-red-900" };
      case "aviso": 
        return { icone: <AlertCircle className="w-6 h-6 text-amber-600" />, cor: "border-amber-200 bg-amber-50", texto: "text-amber-900" };
      default: 
        return { icone: <Info className="w-6 h-6 text-blue-600" />, cor: "border-blue-200 bg-blue-50", texto: "text-blue-900" };
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
          <p className="text-slate-500">Monitorização de notificações de riscos e avisos do sistema.</p>
        </div>

        {/* MODAL PARA O ADMINISTRADOR ADICIONAR ALERTAS */}
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-red-600 hover:bg-red-700 shadow-md font-bold">
              <Plus className="w-4 h-4" /> Emitir Alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-none p-0 overflow-hidden">
            <div className="bg-red-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg"><Bell className="w-6 h-6 text-white" /></div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Emitir Alerta Crítico</DialogTitle>
                  <p className="text-red-100 text-xs">Notifique a população sobre surtos ou emergências.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-2">
                <Label className="text-slate-700 font-bold">Gravidade do Alerta</Label>
                <select 
                  name="categoria" 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  defaultValue="info"
                >
                  <option value="urgente">Urgente (Surto, Bloqueio, Perigo Imediato)</option>
                  <option value="aviso">Aviso (Campanha Próxima, Atenção Extra)</option>
                  <option value="info">Informativo Geral (Apenas aviso de rotina)</option>
                </select>
              </div>

              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Título do Alerta</Label><Input name="titulo" required placeholder="Ex: Surto de Influenza na Zona Sul" /></div>
              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Mensagem / Descrição</Label><Textarea name="descricao" className="resize-none h-24" required placeholder="Instruções claras para a população..." /></div>
              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Região / Localização Afetada</Label><Input name="localizacao" required placeholder="Ex: Bragança Paulista" /></div>
              
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpenCadastro(false)} className="flex-1 font-bold">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold">Disparar Alerta</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
            const estilo = getEstiloAlerta(alerta.categoria);
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
                          {alerta.dataPostada ? new Date(alerta.dataPostada).toLocaleString('pt-BR') : ''}
                        </span>
                      </div>
                      <p className={`${estilo.texto} opacity-80 mt-1`}>{alerta.descricao}</p>
                      {alerta.localizacao && (
                        <span className="inline-block mt-2 text-xs font-bold bg-slate-200/50 px-2 py-0.5 rounded text-slate-700">
                          📍 {alerta.localizacao}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" className="bg-white/50 hover:bg-white text-slate-700" onClick={() => alerta.id && handleMarcarLido(alerta.id)}>
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
import { useEffect, useState } from "react";
import { AlertTriangle, Plus, CheckCircle, Search, Clock } from "lucide-react";
import { alertaService, type Alerta } from "../services/api";
import { Card, CardContent } from "@/components/ui/card"; // <-- Removidos CardHeader e CardTitle daqui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);

  const carregarAlertas = async () => {
    try {
      const dados = await alertaService.listarTodos();
      setAlertas(dados);
    } catch {
      toast.error("Erro ao sincronizar alertas críticos.");
    }
  };

  useEffect(() => { carregarAlertas(); }, []);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const novo: Alerta = {
      tipo: "ALERTA",
      categoria: f.get("categoria") as string,
      titulo: f.get("titulo") as string,
      descricao: f.get("descricao") as string,
      localizacao: f.get("localizacao") as string || undefined,
      lido: false,
      dataPostada: new Date().toISOString()
    };

    try {
      await alertaService.cadastrar(novo);
      toast.success("ALERTA CRÍTICO DISPARADO COM SUCESSO!");
      setOpenCadastro(false);
      carregarAlertas();
    } catch {
      toast.error("Erro ao emitir alerta.");
    }
  };

  const handleMarcarLido = async (id: number) => {
    try {
      await alertaService.marcarComoLido(id);
      toast.success("Alerta arquivado / resolvido!");
      carregarAlertas();
    } catch {
      toast.error("Falha ao atualizar status.");
    }
  };

  const filtrados = alertas.filter(a => a.titulo.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900"><AlertTriangle className="w-8 h-8 text-red-600 animate-bounce" /> Gestão de Alertas Críticos</h1>
        
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 font-bold text-white shadow shadow-red-100 gap-1"><Plus className="w-4 h-4" /> Emitir Alerta Urgente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl border border-red-100">
            <div className="bg-red-600 -m-6 p-6 rounded-t-xl text-white mb-4">
              <DialogTitle className="text-xl font-black text-white">DISPARAR ALERTA DE EMERGÊNCIA</DialogTitle>
              <p className="text-red-100 text-xs mt-1">Isso será enviado instantaneamente para o feed de todos os cidadãos.</p>
            </div>
            <form onSubmit={handleCadastro} className="space-y-4 pt-2">
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Título do Risco</Label><Input name="titulo" required placeholder="Ex: Surto de Dengue Detectado" /></div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Instruções de Proteção / Descrição</Label><textarea name="descricao" required className="w-full min-h-[90px] border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 bg-white" placeholder="Evite acúmulo de água parada..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Bairro / Região Alvo</Label><Input name="localizacao" placeholder="Ex: Bairro Central" required /></div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Gravidade</Label>
                  <select name="categoria" className="h-10 border bg-white rounded-md px-3 text-sm">
                    <option value="urgente">Urgente (Vermelho)</option>
                    <option value="aviso">Aviso Geral (Laranja)</option>
                    <option value="info">Informativo Rápido (Azul)</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-bold text-white h-11 shadow mt-4">Disparar Notificação</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input placeholder="Procurar por alertas ativos no município..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10 bg-white" />
      </div>

      <div className="space-y-4">
        {filtrados.map((a) => (
          <Card key={a.id} className="border-l-4 border-l-red-600 border-y-none border-r-none shadow-sm bg-white">
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-black uppercase bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded">{a.categoria}</span>
                  {a.localizacao && <span className="text-[10px] font-bold text-slate-400">Região: {a.localizacao}</span>}
                </div>
                <h3 className="text-base font-black text-slate-900">{a.titulo}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{a.descricao}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-1"><Clock className="w-3 h-3" /> Postado em: {new Date(a.dataPostada).toLocaleString()}</div>
              </div>
              {a.id && <Button onClick={() => handleMarcarLido(a.id!)} variant="outline" size="sm" className="font-bold gap-1 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"><CheckCircle className="w-4 h-4 text-emerald-500" /> Resolver / Dar Baixa</Button>}
            </CardContent>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm text-slate-400 italic">Nenhum foco de perigo ou alerta crítico ativo no momento. Cidade segura!</div>
        )}
      </div>
    </div>
  );
}
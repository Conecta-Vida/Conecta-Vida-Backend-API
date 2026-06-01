import { useEffect, useState } from "react";
// Importação de ícones legítimos e ativos do Lucide-React
import { ShieldAlert, Radio, CheckCircle2, MapPin, BellRing, Layers, Edit2, Trash2, MoreHorizontal } from "lucide-react";
// Componentes estruturais de interface do Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Alertas() {
  // Estado React que gerencia o array de alertas vindos da API
  const [alertas, setAlertas] = useState<any[]>([]);
  // Controladores de abertura e fechamento de modais (Lançamento e Modificação)
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  // Estado que segura temporariamente os dados do alerta clicado para edição
  const [alertaEditando, setAlertaEditando] = useState<any | null>(null);

  /**
   * OPERAÇÃO 1: CARREGAR ALERTAS DA API (READ)
   * Explicação para o grupo: Faz um GET buscando informativos ativos (tipo ALERTA e lido false).
   */
  const carregarAlertasAtivos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alertas/ativos");
      if (!response.ok) {
        console.error(`🚨 Erro de comunicação de rede! Status HTTP: ${response.status}`);
        throw new Error();
      }
      const dados = await response.json();
      setAlertas(dados);
    } catch (error) {
      console.error("🚨 Detalhes técnicos do erro de rede:", error);
      toast.error("Erro ao conectar à central de monitoramento epidemiológico.");
    }
  };

  useEffect(() => {
    carregarAlertasAtivos();
  }, []);

  /**
   * OPERAÇÃO 2: EMITIR NOVO SINAL DE URGÊNCIA (CREATE)
   */
  const handleDispararAlerta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const novoAlerta = {
      tipo: "ALERTA", // Crucial para o polimorfismo do banco unificado!
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      localizacao: formData.get("localizacao") as string,
      lido: false,
      instituicao: {
        id: Number(formData.get("instituicaoId")) // Passa a Chave Estrangeira (CR6)
      }
    };

    try {
      const response = await fetch("http://localhost:8080/api/comunicacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAlerta)
      });

      if (!response.ok) throw new Error();
      
      toast.success("Alerta epidemiológico transmitido! Notificações push disparadas.");
      setOpenCadastro(false);
      carregarAlertasAtivos();
    } catch {
      toast.error("Falha ao propagar o comunicado de urgência.");
    }
  };

  /**
   * OPERAÇÃO 3: MODIFICAR CONTEÚDO DO ALERTA (UPDATE - NOVIDADE)
   * Explicação para o grupo: Envia um PUT com o objeto alterado para a rota do AlertaController.
   */
  const handleEdicaoAlerta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!alertaEditando?.id) return;
    const formData = new FormData(e.currentTarget);

    const dadosAtualizados = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      localizacao: formData.get("localizacao") as string
    };

    try {
      const response = await fetch(`http://localhost:8080/api/alertas/${alertaEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!response.ok) throw new Error();

      toast.success("Alerta sanitário modificado com sucesso!");
      setOpenEdicao(false);
      setAlertaEditando(null); // Limpa a memória temporária
      carregarAlertasAtivos(); // Atualiza a tela
    } catch {
      toast.error("Erro ao aplicar alterações no informativo técnico.");
    }
  };

  /**
   * OPERAÇÃO 4: REMOVER ALERTA FISICAMENTE (DELETE - NOVIDADE)
   * Explicação para o grupo: Aciona o método DELETE da API deletando permanentemente a linha do banco.
   */
  const handleDeletarAlerta = async (id: number) => {
    if (!confirm("Tem certeza de que deseja excluir permanentemente este alerta? Esta ação não pode ser desfeita.")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/alertas/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error();

      toast.success("Alerta removido com sucesso do sistema.");
      carregarAlertasAtivos();
    } catch {
      toast.error("Não foi possível excluir o alerta selecionado.");
    }
  };

  /**
   * OPERAÇÃO EXTRA: ARQUIVAR ALERTA (UPDATE STATUS DE LEITURA)
   */
  const handleMarcarComoLido = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/alertas/${id}/ler`, {
        method: "PUT"
      });
      if (!response.ok) throw new Error();
      toast.success("Alerta arquivado e reconhecido pelo comitê gestor.");
      carregarAlertasAtivos();
    } catch {
      toast.error("Erro ao atualizar o status do informativo técnico.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* SEÇÃO DO CABEÇALHO */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900">
            <ShieldAlert className="w-8 h-8 text-rose-600 animate-pulse" /> Alertas Críticos
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-1">Transmissão de surtos, bloqueios sanitários e contingências regionais em tempo real.</p>
        </div>

        {/* MODAL DE DISPARO/EMISSÃO */}
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="bg-rose-600 font-bold hover:bg-rose-700 shadow-sm gap-1 text-white border-none">
              <Radio className="w-4 h-4 animate-ping" /> Emitir Sinal de Urgência
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl shadow-lg border-none">
            <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-rose-600" /> Transmitir Comunicado de Emergência
            </DialogTitle>
            <form onSubmit={handleDispararAlerta} className="space-y-4 pt-4">
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Título do Incidente</Label>
                <Input name="titulo" required placeholder="Ex: Surto Incomum de Dengue Tipo 3 Encontrado" />
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Instruções de Contingência à População</Label>
                <textarea name="descricao" required rows={3} placeholder="Escreva as recomendações preventivas imediatas..." className="w-full border rounded-md p-2.5 text-sm border-slate-200 outline-none focus:ring-2 focus:ring-rose-600 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Grau de Risco</Label>
                  <select name="categoria" required className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold border-slate-200">
                    <option value="Epidemia">Epidemia (Dispara Push Mobile)</option>
                    <option value="Urgência">Urgência Técnica</option>
                    <option value="Informativo">Aviso Geral</option>
                  </select>
                </div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Foco Geográfico</Label><Input name="localizacao" required placeholder="Ex: Zona Sul" /></div>
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Código ID do Órgão de Saúde Emissor (CR6)</Label>
                <Input name="instituicaoId" type="number" required placeholder="Digite o ID numérico da UBS emissora" />
              </div>
              <Button type="submit" className="w-full bg-rose-600 font-bold text-white h-11 hover:bg-rose-700 shadow mt-2 border-none">Propagar Sinal nas Plataformas</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* PAINEL DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertas.map((a) => (
          <Card key={a.id} className="bg-white border-l-4 border-l-rose-600 border-y-slate-100 border-r-slate-100 shadow-sm overflow-hidden rounded-xl relative group">
            <CardContent className="p-5 space-y-4">
              
              {/* MENU SUSPENSO DE AÇÕES (EDITAR / DELETAR) - ADICIONADO CONFORME PEDIDO */}
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32 border bg-white shadow-md rounded-lg p-1">
                    <DropdownMenuItem onClick={() => { setAlertaEditando(a); setOpenEdicao(true); }} className="gap-2 cursor-pointer font-bold text-xs text-amber-600 px-3 py-2 rounded hover:bg-slate-50"><Edit2 className="w-3.5 h-3.5" /> Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => a.id && handleDeletarAlerta(a.id)} className="gap-2 cursor-pointer font-bold text-xs text-red-600 px-3 py-2 rounded hover:bg-slate-50"><Trash2 className="w-3.5 h-3.5" /> Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">⚠️ {a.categoria || "URGÊNCIA"}</span>
                <h3 className="text-lg font-black text-slate-900 mt-2 pr-8">{a.titulo}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{a.descricao}</p>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> Região: {a.localizacao}</span>
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Origem: {a.instituicao?.nome || "Órgão Central"}</span>
              </div>
              
              <Button onClick={() => handleMarcarComoLido(a.id)} variant="outline" className="w-full border-rose-200 text-rose-700 font-bold hover:bg-rose-50 gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Marcar como Lido / Resolvido
              </Button>
            </CardContent>
          </Card>
        ))}

        {alertas.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-14 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 italic font-semibold text-sm">
            Nenhum incidente sanitário ou surto epidemiológico ativo na região. Sistema seguro.
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO DO ALERTA CRÍTICO - ADICIONADO CONFORME PEDIDO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl shadow-lg border-none">
          <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-amber-500" /> Modificar Alerta Técnico Sanitário
          </DialogTitle>
          {alertaEditando && (
            <form onSubmit={handleEdicaoAlerta} className="space-y-4 pt-4">
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Título do Incidente</Label>
                <Input name="titulo" defaultValue={alertaEditando.titulo} required />
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Instruções de Contingência</Label>
                <textarea name="descricao" defaultValue={alertaEditando.descricao} required rows={3} className="w-full border rounded-md p-2.5 text-sm border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Grau de Risco</Label>
                  <select name="categoria" defaultValue={alertaEditando.categoria} className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold border-slate-200">
                    <option value="Epidemia">Epidemia</option>
                    <option value="Urgência">Urgência Técnica</option>
                    <option value="Informativo">Aviso Geral</option>
                  </select>
                </div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Foco Geográfico</Label><Input name="localizacao" defaultValue={alertaEditando.localizacao} required /></div>
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-white h-11 shadow mt-4 border-none">Salvar Alterações no Alerta</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
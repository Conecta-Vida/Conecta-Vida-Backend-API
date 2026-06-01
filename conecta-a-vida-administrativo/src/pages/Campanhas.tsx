import { useEffect, useState } from "react";
// Importação de ícones legítimos da biblioteca Lucide
import { Megaphone, Calendar, CheckCircle2, Plus, Users, Layers, Edit2, Trash2, MoreHorizontal } from "lucide-react"; 
// Conexão com os nossos serviços assíncronos integrados ao Back-end Java
import { campanhaService, usuarioService, type Campanha } from "../services/api";
// Componentes visuais de alta fidelidade do Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Campanhas() {
  // Estado React que armazena a lista de campanhas puxadas do Supabase
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  // Controladores de abertura e fechamento das janelas modais popup
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  // Estado que segura as informações da campanha que o gestor escolheu alterar
  const [campanhaEditando, setCampanhaEditando] = useState<Campanha | null>(null);

  /**
   * OPERAÇÃO 1: CARREGAR CAMPANHAS DO BANCO (READ)
   * Explicação para o grupo: Dispara um GET para a API unificada. Traz todas as 
   * linhas da tabela "public.comunicacoes" onde o tipo é igual a 'CAMPANHA'.
   */
  const carregarCampanhas = async () => {
    try {
      const dados = await campanhaService.listarTodas();
      setCampanhas(dados);
    } catch {
      toast.error("Erro ao sincronizar cronograma de campanhas.");
    }
  };

  // Faz a listagem rodar na tela automaticamente assim que o usuário abre a página
  useEffect(() => { 
    carregarCampanhas(); 
  }, []);

  /**
   * OPERAÇÃO 2: PUBLICAR NOVA CAMPANHA (CREATE - REQUISITO CR3)
   * Explicação para o grupo: Captura as informações do formulário e monta o payload JSON. 
   * Injeta o tipo fixo "CAMPANHA" para alimentar o polimorfismo da nossa tabela única.
   */
  const handleCadastroCampanha = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Objeto construído combinando os atributos do banco com a FK da Unidade de Saúde
    const novaCampanha: any = {
      tipo: "CAMPANHA",
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      publicoAlvo: formData.get("publicoAlvo") as string,
      status: "ATIVA",
      // Transforma o input datetime do navegador no formato timestamp aceito pelo PostgreSQL
      dataInicio: formData.get("dataInicio") ? new Date(formData.get("dataInicio") as string).toISOString() : undefined,
      dataFim: formData.get("dataFim") ? new Date(formData.get("dataFim") as string).toISOString() : undefined,
      instituicao: {
        id: Number(formData.get("instituicaoId")) // Cumpre o relacionamento Um-para-Muitos (CR6)
      }
    };

    try {
      await campanhaService.cadastrar(novaCampanha);
      toast.success("Nova campanha de saúde publicada com sucesso!");
      setOpenCadastro(false); // Fecha o modal
      carregarCampanhas(); // Recarrega os cartões instantaneamente
    } catch {
      toast.error("Falha ao salvar a nova campanha.");
    }
  };

  /**
   * OPERAÇÃO 3: SALVAR EDICÃO DE CAMPANHA (UPDATE - REQUISITO CR3)
   * Explicação para o grupo: Captura as alterações feitas no modal, anexa o ID original 
   * da campanha e envia um método PUT para o Back-end persistir no Supabase.
   */
  const handleEdicaoCampanha = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campanhaEditando?.id) return; // Proteção para garantir que o ID existe
    const formData = new FormData(e.currentTarget);

    const dadosAtualizados: any = {
      tipo: "CAMPANHA",
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      publicoAlvo: formData.get("publicoAlvo") as string,
      status: formData.get("status") as string,
      dataInicio: formData.get("dataInicio") ? new Date(formData.get("dataInicio") as string).toISOString() : undefined,
      dataFim: formData.get("dataFim") ? new Date(formData.get("dataFim") as string).toISOString() : undefined,
    };

    try {
      await campanhaService.atualizar(campanhaEditando.id, dadosAtualizados);
      toast.success("Campanha de saúde atualizada com sucesso!");
      setOpenEdicao(false);
      setCampanhaEditando(null); // Limpa o estado da memória
      carregarCampanhas(); // Atualiza a visualização
    } catch {
      toast.error("Erro ao salvar as modificações da campanha.");
    }
  };

  /**
   * OPERAÇÃO 4: EXCLUIR CAMPANHA DO ECOSSISTEMA (DELETE - REQUISITO CR3)
   * Explicação para o grupo: Pede uma confirmação em tela. Se aceito, envia o comando DELETE 
   * para a API remover o registro do banco de dados de forma definitiva.
   */
  const handleDeletarCampanha = async (id: number) => {
    if (!confirm("Tem certeza absoluta de que deseja remover esta campanha de saúde do sistema?")) return;
    try {
      await campanhaService.deletar(id);
      toast.success("Campanha removida com sucesso do sistema.");
      carregarCampanhas();
    } catch {
      toast.error("Não foi possível excluir a campanha de saúde.");
    }
  };

  /**
   * CRITERIO CR7: GRAVAÇÃO RELACIONAL MUITOS-PARA-MUITOS
   * Explicação para o grupo: Vincula o cidadão que está logado no sistema à campanha selecionada.
   * Dispara uma gravação direta na nossa tabela associativa física "public.usuarios_campanhas", 
   * guardando o par contendo usuario_id e comunicacao_id.
   */
  const handleAdesaoCidadao = async (campanhaId: number) => {
    const adminLogado = JSON.parse(localStorage.getItem("@conecta:admin") || "{}");
    if (!adminLogado.id) {
      toast.error("Nenhum usuário ativo identificado para inscrição.");
      return;
    }

    try {
      // CORRIGIDO: Vinculado corretamente à variável local 'campanhaId' em português
      await usuarioService.inscreverEmCampanha(adminLogado.id, campanhaId);
      toast.success("Cidadão vinculado ao mutirão com sucesso! (CR7 Computado)");
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar inscrição.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* SEÇÃO DO CABEÇALHO */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-100">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900">
            <Megaphone className="w-8 h-8 text-emerald-600" /> Campanhas de Saúde
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-1">Gerenciamento de mutirões públicos e engajamento comunitário.</p>
        </div>

        {/* MODAL DE CADASTRO POPUP */}
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 font-bold hover:bg-emerald-700 shadow-sm gap-1 text-white border-none">
              <Plus className="w-4 h-4" /> Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl shadow-lg border-none">
            <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Publicar Nova Campanha de Saúde
            </DialogTitle>
            <form onSubmit={handleCadastroCampanha} className="space-y-4 pt-4">
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Título da Campanha</Label>
                <Input name="titulo" required placeholder="Ex: Campanha de Vacinação contra a Gripe 2026" />
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Descrição Detalhada</Label>
                <textarea name="descricao" required rows={3} placeholder="Descreva o objetivo da campanha, locais e orientações..." className="w-full border rounded-md p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-600 outline-none border-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Categoria (Tema)</Label>
                  <select name="categoria" required className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold border-slate-200">
                    <option value="Vacinação">Vacinação</option>
                    <option value="Doação de Sangue">Doação de Sangue</option>
                    <option value="Prevenção / Checkup">Prevenção / Checkup</option>
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Público-Alvo</Label>
                  <Input name="publicoAlvo" required placeholder="Ex: Idosos e Crianças" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Código ID da Unidade de Saúde Responsável (CR6)</Label>
                <Input name="instituicaoId" type="number" required placeholder="Ex: Digite o ID numérico da UBS cadastrada" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data de Início</Label><Input name="dataInicio" type="datetime-local" required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data de Encerramento</Label><Input name="dataFim" type="datetime-local" required /></div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 font-bold text-white h-11 shadow mt-4 hover:bg-emerald-700 border-none">Salvar e Publicar Mutirão no Banco</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* RENDERIZAÇÃO EM GRID DOS CARTÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campanhas.map((c) => (
          <Card key={c.id} className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-xl relative group">
            <CardContent className="p-5 space-y-4">
              
              {/* MENU SUSPENSO DE AÇÕES INDIVIDUAIS */}
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32 border bg-white shadow-md rounded-lg p-1">
                    <DropdownMenuItem onClick={() => { setCampanhaEditando(c); setOpenEdicao(true); }} className="gap-2 cursor-pointer font-bold text-xs text-amber-600 px-3 py-2 rounded hover:bg-slate-50"><Edit2 className="w-3.5 h-3.5" /> Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => c.id && handleDeletarCampanha(c.id)} className="gap-2 cursor-pointer font-bold text-xs text-red-600 px-3 py-2 rounded hover:bg-slate-50"><Trash2 className="w-3.5 h-3.5" /> Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">{c.status || "ATIVA"}</span>
                <h3 className="text-lg font-black text-slate-900 mt-2 pr-8">{c.titulo}</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{c.descricao}</p>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 border-t pt-3 border-slate-50">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-500" /> Alvo: {c.publicoAlvo}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Início: {c.dataInicio ? new Date(c.dataInicio).toLocaleDateString() : "-"}</span>
              </div>
              <Button onClick={() => c.id && handleAdesaoCidadao(c.id)} className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700 gap-1.5 shadow border-none"><CheckCircle2 className="w-4 h-4" /> Registrar Presença de Cidadão (CR7)</Button>
            </CardContent>
          </Card>
        ))}

        {campanhas.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-14 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 italic font-semibold text-sm">
            Nenhuma campanha ativa ou cadastrada no ecossistema Conecta Vida.
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO DINÂMICA */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl shadow-lg border-none">
          <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3 flex items-center gap-2"><Edit2 className="w-5 h-5 text-amber-500" /> Modificar Campanha de Saúde</DialogTitle>
          {campanhaEditando && (
            <form onSubmit={handleEdicaoCampanha} className="space-y-4 pt-4">
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Título</Label><Input name="titulo" defaultValue={campanhaEditando.titulo} required /></div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Descrição</Label><textarea name="descricao" defaultValue={campanhaEditando.descricao} required rows={3} className="w-full border rounded-md p-2.5 text-sm border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Categoria (Tema)</Label>
                  <select name="categoria" defaultValue={campanhaEditando.categoria} className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold border-slate-200">
                    <option value="Vacinação">Vacinação</option>
                    <option value="Doação de Sangue">Doação de Sangue</option>
                    <option value="Prevenção / Checkup">Prevenção / Checkup</option>
                  </select>
                </div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Público-Alvo</Label><Input name="publicoAlvo" defaultValue={campanhaEditando.publicoAlvo} required /></div>
              </div>
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Estado da Campanha</Label>
                <select name="status" defaultValue={campanhaEditando.status} className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold border-slate-200">
                  <option value="ATIVA">ATIVA (Visível no Mobile)</option>
                  <option value="CONCLUÍDA">CONCLUÍDA (Histórico)</option>
                </select>
              </div>
              {/* CORRIGIDO: Amarrado perfeitamente às propriedades da variável em português campanhaEditando */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data de Início</Label><Input name="dataInicio" type="datetime-local" defaultValue={campanhaEditando.dataInicio ? campanhaEditando.dataInicio.substring(0, 16) : ""} required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data de Fim</Label><Input name="dataFim" type="datetime-local" defaultValue={campanhaEditando.dataFim ? campanhaEditando.dataFim.substring(0, 16) : ""} required /></div>
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-white h-11 shadow mt-4 border-none">Salvar Alterações no Banco</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
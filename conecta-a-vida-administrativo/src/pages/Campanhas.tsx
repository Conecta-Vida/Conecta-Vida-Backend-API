import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Plus, Calendar, Users, Clock, CheckCircle2, AlertCircle, Loader2, Image, MapPin, Tag, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Campanha, campanhaService, noticiaService } from "../services/api";
import { toast } from "sonner";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [tipoPublicacao, setTipoPublicacao] = useState("CAMPANHA");
  const [campanhaEditando, setCampanhaEditando] = useState<Campanha | null>(null);

  const carregarCampanhas = async () => {
    try {
      const dados = await campanhaService.listarTodas();
      setCampanhas(dados);
    } catch (error) {
      toast.error("Erro ao carregar campanhas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarCampanhas(); }, []);

  const formatarDataParaInput = (dataIso: string | undefined) => {
    if (!dataIso) return "";
    return dataIso.split("T")[0];
  };

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tipo = formData.get("tipoPublicacao") as string;

    const dadosBase = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      linkimagem: formData.get("linkimagem") as string,
      localizacao: formData.get("localizacao") as string,
    };

    if (tipo === "NOTICIA") {
      const novaNoticia = {
        ...dadosBase,
        status: "Publicada"
      };

      try {
        await noticiaService.cadastrar(novaNoticia);
        toast.success("Nova notícia publicada com sucesso!");
        setOpenCadastro(false);
        carregarCampanhas();
      } catch (error) {
        toast.error("Erro ao publicar a notícia.");
      }
    } else {
      const novaCampanha: Campanha = {
        ...dadosBase,
        dataInicio: new Date(formData.get("inicio") as string).toISOString(),
        dataFim: new Date(formData.get("fim") as string).toISOString(),
        publicoAlvo: formData.get("publico") as string,
        status: "Agendada",
      };

      try {
        await campanhaService.cadastrar(novaCampanha);
        toast.success("Nova campanha lançada com sucesso!");
        setOpenCadastro(false);
        carregarCampanhas();
      } catch (error) {
        toast.error("Erro ao salvar no banco de dados.");
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!campanhaEditando?.id) return;

    const formData = new FormData(e.currentTarget);
    const dadosAtualizados: Campanha = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      categoria: formData.get("categoria") as string,
      linkimagem: formData.get("linkimagem") as string,
      localizacao: formData.get("localizacao") as string,
      dataInicio: new Date(formData.get("inicio") as string).toISOString(),
      dataFim: new Date(formData.get("fim") as string).toISOString(),
      publicoAlvo: formData.get("publico") as string,
      status: formData.get("status") as string,
    };

    try {
      await campanhaService.atualizar(campanhaEditando.id, dadosAtualizados);
      toast.success("Campanha atualizada com sucesso!");
      setOpenEdicao(false);
      carregarCampanhas();
    } catch {
      toast.error("Erro ao atualizar dados da campanha.");
    }
  };

  const handleEliminar = async (id: number, titulo: string) => {
    if (!confirm(`Tem a certeza que deseja remover de forma definitiva a campanha "${titulo}"?`)) return;

    try {
      await campanhaService.deletar(id);
      toast.success("Campanha removida com sucesso.");
      carregarCampanhas();
    } catch {
      toast.error("Erro ao tentar eliminar a campanha.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativa": return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3"/> Ativa</span>;
      case "Encerrada": return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700"><Clock className="w-3 h-3"/> Encerrada</span>;
      default: return <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><AlertCircle className="w-3 h-3"/> Agendada</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campanhas de Saúde</h1>
          <p className="text-slate-500">Faça a gestão de eventos, mutirões e ações de saúde para a comunidade.</p>
        </div>
        
        {/* MODAL DE CADASTRO */}
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md font-bold">
              <Plus className="w-4 h-4" /> Nova Publicação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] border-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 p-6 text-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg"><Megaphone className="w-6 h-6 text-white" /></div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Criar Publicação Oficial</DialogTitle>
                  <p className="text-emerald-100 text-xs">Divulgue campanhas ou informativos gerais no app.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-1.5">
                <Label className="text-slate-700 font-bold flex items-center gap-1.5"><Tag className="w-4 h-4 text-slate-400"/> Tipo de Destino</Label>
                <select name="tipoPublicacao" value={tipoPublicacao} onChange={(e) => setTipoPublicacao(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium">
                  <option value="CAMPANHA">Campanha de Saúde (Vacinação, Mutirão, Evento Local)</option>
                  <option value="NOTICIA">Notícia Regular (Informativo de Rotina, Comunicado Geral)</option>
                </select>
              </div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Título da Publicação</Label><Input name="titulo" required placeholder="Ex: Vacinação Contra a Gripe 2026" /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Categoria / Tag Informativa</Label><Input name="categoria" placeholder="Ex: Vacinação, Prevenção" required /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Conteúdo / Descrição</Label><Textarea name="descricao" className="resize-none h-24" required placeholder="Orientações e detalhes..." /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold flex items-center gap-1.5"><Image className="w-4 h-4 text-slate-400"/> URL da Imagem (Opcional)</Label><Input name="linkimagem" type="url" placeholder="https://exemplo.com/banner.jpg" /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> Localização / Endereço</Label><Input name="localizacao" placeholder="Ex: UBS Central" required /></div>
              
              {tipoPublicacao === "CAMPANHA" && (
                <div className="border-t border-slate-100 pt-4 space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Data de Início</Label><Input name="inicio" type="date" required /></div>
                    <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Data de Término</Label><Input name="fim" type="date" required /></div>
                  </div>
                  <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Público-Alvo</Label><Input name="publico" required placeholder="Ex: Idosos e Gestantes" /></div>
                </div>
              )}
              
              <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenCadastro(false)} className="flex-1 font-bold">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-white">Salvar e Lançar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[550px] border-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="bg-amber-500 p-6 text-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold text-white">Editar Campanha de Saúde</DialogTitle>
            <p className="text-amber-100 text-xs">Modifique as informações operacionais salvas no banco de dados.</p>
          </div>
          {campanhaEditando && (
            <form onSubmit={handleUpdate} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-1.5">
                <Label className="text-slate-700 font-bold">Status Atual do Evento</Label>
                <select name="status" defaultValue={campanhaEditando.status} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium">
                  <option value="Agendada">Agendada (Ainda não iniciada)</option>
                  <option value="Ativa">Ativa (Em andamento no momento)</option>
                  <option value="Encerrada">Encerrada (Finalizada/Arquivada)</option>
                </select>
              </div>

              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Título da Campanha</Label><Input name="titulo" defaultValue={campanhaEditando.titulo} required /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Categoria / Tag</Label><Input name="categoria" defaultValue={campanhaEditando.categoria} required /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Conteúdo da Descrição</Label><Textarea name="descricao" defaultValue={campanhaEditando.descricao} className="resize-none h-24" required /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold flex items-center gap-1.5"><Image className="w-4 h-4 text-slate-400"/> URL da Imagem de Capa</Label><Input name="linkimagem" type="url" defaultValue={campanhaEditando.linkimagem} /></div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> Localização / Endereço</Label><Input name="localizacao" defaultValue={campanhaEditando.localizacao} required /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Data de Início</Label><Input name="inicio" type="date" defaultValue={formatarDataParaInput(campanhaEditando.dataInicio)} required /></div>
                <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Data de Término</Label><Input name="fim" type="date" defaultValue={formatarDataParaInput(campanhaEditando.dataFim)} required /></div>
              </div>
              <div className="grid gap-1.5"><Label className="text-slate-700 font-bold">Público-Alvo</Label><Input name="publico" defaultValue={campanhaEditando.publicoAlvo} required /></div>

              <div className="flex gap-2 mt-2 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenEdicao(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white">Salvar Alterações</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* LISTAGEM DE CARDS */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col bg-white relative">
              {campanha.linkimagem && (
                <div className="w-full h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img src={campanha.linkimagem} alt={campanha.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              
              {/* BOTÃO DE TRÊS PONTOS DE AÇÕES */}
              <div className="absolute right-3 top-3 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white backdrop-blur shadow-sm">
                      <MoreHorizontal className="h-4 w-4 text-slate-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => { setCampanhaEditando(campanha); setOpenEdicao(true); }} className="gap-2 cursor-pointer text-amber-600 font-medium">
                      <Edit2 className="w-4 h-4"/> Editar
                    </DropdownMenuItem>
                    {/* CORRIGIDO: de campaña.titulo para campanha.titulo */}
                    <DropdownMenuItem onClick={() => campanha.id && handleEliminar(campanha.id, campanha.titulo)} className="gap-2 text-red-600 font-medium cursor-pointer">
                      <Trash2 className="w-4 h-4"/> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start gap-2 pr-8">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Megaphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getStatusBadge(campanha.status)}
                    {campanha.categoria && (
                      <span className="text-[10px] font-black tracking-wide text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">
                        {campanha.categoria}
                      </span>
                    )}
                  </div>
                </div>
                
                <Link to={`/campanhas/${campanha.id}`}>
                  <CardTitle className="text-xl mt-4 text-slate-800 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2 leading-tight">
                    {campanha.titulo}
                  </CardTitle>
                </Link>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-0">
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{campanha.descricao}</p>
                
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {campanha.localizacao && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{campanha.localizacao}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Público:</span>
                    <span className="font-semibold text-slate-700 truncate">{campanha.publicoAlvo || "Geral"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium">
                      {campanha.dataInicio ? new Date(campanha.dataInicio).toLocaleDateString('pt-BR') : ""} - {campanha.dataFim ? new Date(campanha.dataFim).toLocaleDateString('pt-BR') : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {campanhas.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Megaphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhuma campanha cadastrada no momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import { Building2, Search, Plus, MoreHorizontal, Edit2, Trash2, Mail, Phone, MapPin, Globe, Clock } from "lucide-react";
import { type InstituicaoSaude, instituicaoService } from "../services/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Instituicoes() {
  const [instituicoes, setInstituicoes] = useState<InstituicaoSaude[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [instituicaoEditando, setInstituicaoEditando] = useState<InstituicaoSaude | null>(null);

  const carregarInstituicoes = async () => {
    try {
      const dados = await instituicaoService.listarTodas();
      setInstituicoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      toast.error("Erro ao carregar lista de instituições.");
    }
  };

  useEffect(() => { carregarInstituicoes(); }, []);

  const instituicoesFiltradas = useMemo(() => {
    const termo = (busca || "").toLowerCase();
    return instituicoes.filter(i => 
      String(i.nome).toLowerCase().includes(termo) || 
      String(i.tipoInstituicao).toLowerCase().includes(termo) ||
      String(i.endereco || "").toLowerCase().includes(termo)
    );
  }, [instituicoes, busca]);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nova: InstituicaoSaude = {
      nome: formData.get("nome") as string,
      tipoInstituicao: formData.get("tipoInstituicao") as string,
      email: formData.get("email") as string || undefined,
      telefone: formData.get("telefone") as string || undefined,
      linksite: formData.get("linksite") as string || undefined,
      endereco: formData.get("endereco") as string || undefined,
      horarioSegSex: formData.get("horarioSegSex") as string || undefined,
      horarioSabado: formData.get("horarioSabado") as string || undefined,
      horarioDomingo: formData.get("horarioDomingo") as string || undefined,
    };

    try {
      await instituicaoService.cadastrar(nova);
      toast.success("Instituição de saúde cadastrada com sucesso!");
      setOpenCadastro(false);
      carregarInstituicoes();
    } catch {
      toast.error("Erro ao tentar cadastrar a instituição.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!instituicaoEditando?.id) return;

    const formData = new FormData(e.currentTarget);
    const dadosAtualizados: InstituicaoSaude = {
      nome: formData.get("nome") as string,
      tipoInstituicao: formData.get("tipoInstituicao") as string,
      email: formData.get("email") as string || undefined,
      telefone: formData.get("telefone") as string || undefined,
      linksite: formData.get("linksite") as string || undefined,
      endereco: formData.get("endereco") as string || undefined,
      horarioSegSex: formData.get("horarioSegSex") as string || undefined,
      horarioSabado: formData.get("horarioSabado") as string || undefined,
      horarioDomingo: formData.get("horarioDomingo") as string || undefined,
    };

    try {
      await instituicaoService.atualizar(instituicaoEditando.id, dadosAtualizados);
      toast.success("Instituição atualizada com sucesso!");
      setOpenEdicao(false);
      carregarInstituicoes();
    } catch {
      toast.error("Erro ao atualizar dados.");
    }
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja remover a instituição ${nome}?`)) return;

    try {
      await instituicaoService.deletar(id);
      toast.success("Instituição removida do sistema.");
      carregarInstituicoes();
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* SEÇÃO SUPERIOR: TÍTULO E AÇÕES */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" /> Unidades de Saúde
        </h1>
        
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 gap-2 font-bold shadow-md hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Nova Unidade
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 overflow-hidden border-none shadow-2xl sm:max-w-[600px]">
            <div className="bg-blue-600 p-6 text-white">
              <DialogTitle className="text-xl font-bold text-white">Cadastrar Unidade de Saúde</DialogTitle>
              <p className="text-blue-100 text-xs">Adicione um novo posto, UBS ou hospital de atendimento público.</p>
            </div>
            
            <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Nome da Unidade</Label>
                  <Input name="nome" required placeholder="Ex: UBS Central" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Tipo da Instituição</Label>
                  <select name="tipoInstituicao" required className="flex h-10 w-full rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                    <option value="UNIDADE">Unidade Básica (UBS)</option>
                    <option value="HOSPITAL">Hospital Geral</option>
                    <option value="POSTO">Posto de Saúde</option>
                    <option value="UPA">Pronto Atendimento (UPA)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Endereço Completo</Label>
                <Input name="endereco" placeholder="Rua, Número, Bairro" className="bg-slate-50/50" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700 flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> Telefone</Label>
                  <Input name="telefone" placeholder="(11) 4002-8922" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700 flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> E-mail</Label>
                  <Input name="email" type="email" placeholder="contato@ubs.com" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700 flex items-center gap-1"><Globe className="w-3.5 h-3.5"/> Website</Label>
                  <Input name="linksite" placeholder="www.ubs.gov.br" className="bg-slate-50/50" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-3"><Clock className="w-4 h-4 text-orange-500"/> Horários de Atendimento</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-1.5"><Label className="text-xs font-semibold">Segunda a Sexta</Label><Input name="horarioSegSex" placeholder="07:00 às 19:00" /></div>
                  <div className="grid gap-1.5"><Label className="text-xs font-semibold">Sábados</Label><Input name="horarioSabado" placeholder="08:00 às 12:00" /></div>
                  <div className="grid gap-1.5"><Label className="text-xs font-semibold">Domingos</Label><Input name="horarioDomingo" placeholder="Fechado" /></div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 font-bold mt-4 h-11 text-white hover:bg-blue-700 shadow">
                Confirmar Cadastro
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="p-0 overflow-hidden border-none shadow-2xl sm:max-w-[600px]">
          <div className="bg-amber-500 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white">Editar Dados da Unidade</DialogTitle>
            <p className="text-amber-100 text-xs">Atualize as informações públicas e cronogramas de atendimento.</p>
          </div>
          {instituicaoEditando && (
            <form onSubmit={handleUpdate} className="p-6 grid gap-4 bg-white max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Nome da Unidade</Label><Input name="nome" defaultValue={instituicaoEditando.nome} required /></div>
                <div className="grid gap-2">
                  <Label>Tipo da Instituição</Label>
                  <select name="tipoInstituicao" defaultValue={instituicaoEditando.tipoInstituicao} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                    <option value="UNIDADE">Unidade Básica (UBS)</option>
                    <option value="HOSPITAL">Hospital Geral</option>
                    <option value="POSTO">Posto de Saúde</option>
                    <option value="UPA">Pronto Atendimento (UPA)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2"><Label>Endereço Completo</Label><Input name="endereco" defaultValue={instituicaoEditando.endereco || ""} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2"><Label>Telefone</Label><Input name="telefone" defaultValue={instituicaoEditando.telefone || ""} /></div>
                <div className="grid gap-2"><Label>E-mail</Label><Input name="email" type="email" defaultValue={instituicaoEditando.email || ""} /></div>
                <div className="grid gap-2"><Label>Website</Label><Input name="linksite" defaultValue={instituicaoEditando.linksite || ""} /></div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2"><Clock className="w-3.5 h-3.5"/> Horários de Atendimento</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2"><Label className="text-xs">Segunda a Sexta</Label><Input name="horarioSegSex" defaultValue={instituicaoEditando.horarioSegSex || ""} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Sábados</Label><Input name="horarioSabado" defaultValue={instituicaoEditando.horarioSabado || ""} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Domingos</Label><Input name="horarioDomingo" defaultValue={instituicaoEditando.horarioDomingo || ""} /></div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenEdicao(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white">Salvar Alterações</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* FILTRO DE BUSCA */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Procurar por nome da unidade, tipo ou localização..." 
          className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-600 shadow-sm" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
      </div>

      {/* TABELA DE EXIBIÇÃO */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Nome da Unidade</TableHead>
              <TableHead className="font-bold text-slate-700">Tipo</TableHead>
              <TableHead className="font-bold text-slate-700">Contato</TableHead>
              <TableHead className="font-bold text-slate-700">Endereço</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instituicoesFiltradas.map((i) => (
              <TableRow key={i.id} className="hover:bg-slate-50/50">
                <TableCell className="font-semibold text-slate-900">{i.nome}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    i.tipoInstituicao === 'HOSPITAL' ? 'bg-red-50 text-red-700 border border-red-100' :
                    i.tipoInstituicao === 'UPA' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                    'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {i.tipoInstituicao}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-xs space-y-0.5">
                  {i.telefone && <div className="flex items-center gap-1 text-slate-700 font-medium"><Phone className="w-3 h-3 text-slate-400"/> {i.telefone}</div>}
                  {i.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400"/> {i.email}</div>}
                </TableCell>
                <TableCell className="text-slate-500 text-xs max-w-[200px] truncate">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400 shrink-0"/> {i.endereco || "-"}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => { setInstituicaoEditando(i); setOpenEdicao(true); }} className="gap-2 cursor-pointer text-amber-600 font-medium">
                        <Edit2 className="w-4 h-4"/> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => i.id && handleExcluir(i.id, i.nome)} className="gap-2 text-red-600 cursor-pointer font-medium">
                        <Trash2 className="w-4 h-4"/> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {instituicoesFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400 italic">
                  Nenhuma unidade de saúde registrada ou encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
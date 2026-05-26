import { useEffect, useState, useMemo } from "react";
import { Building2, Search, Plus, MoreHorizontal, Edit2, Mail, Phone, MapPin, Clock } from "lucide-react"; // <-- Removido o Trash2 daqui
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
      setInstituicoes(dados);
    } catch {
      toast.error("Erro ao carregar lista de instituições.");
    }
  };

  useEffect(() => { carregarInstituicoes(); }, []);

  // CORRIGIDO AQUI: Alterado de institutions para instituicoes para bater com o useState
  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return instituicoes.filter((i) => 
      i.nome.toLowerCase().includes(termo) || (i.endereco || "").toLowerCase().includes(termo)
    );
  }, [instituicoes, busca]);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nova: InstituicaoSaude = {
      nome: f.get("nome") as string,
      tipoInstituicao: f.get("tipoInstituicao") as string,
      email: f.get("email") as string || undefined,
      telefone: f.get("telefone") as string || undefined,
      linksite: f.get("linksite") as string || undefined,
      endereco: f.get("endereco") as string || undefined,
      horarioSegSex: f.get("horarioSegSex") as string || undefined,
      horarioSabado: f.get("horarioSabado") as string || undefined,
      horarioDomingo: f.get("horarioDomingo") as string || undefined,
    };

    try {
      await instituicaoService.cadastrar(nova);
      toast.success("Unidade cadastrada com sucesso!");
      setOpenCadastro(false);
      carregarInstituicoes();
    } catch {
      toast.error("Erro ao tentar cadastrar.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!instituicaoEditando?.id) return;
    const f = new FormData(e.currentTarget);
    const dados: InstituicaoSaude = {
      nome: f.get("nome") as string,
      tipoInstituicao: f.get("tipoInstituicao") as string,
      email: f.get("email") as string || undefined,
      telefone: f.get("telefone") as string || undefined,
      linksite: f.get("linksite") as string || undefined,
      endereco: f.get("endereco") as string || undefined,
      horarioSegSex: f.get("horarioSegSex") as string || undefined,
      horarioSabado: f.get("horarioSabado") as string || undefined,
      horarioDomingo: f.get("horarioDomingo") as string || undefined,
    };

    try {
      await instituicaoService.atualizar(instituicaoEditando.id, dados);
      toast.success("Dados atualizados!");
      setOpenEdicao(false);
      carregarInstituicoes();
    } catch {
      toast.error("Erro na atualização.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900"><Building2 className="w-8 h-8 text-blue-600" /> Unidades de Saúde</h1>
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild><Button className="bg-blue-600 font-bold hover:bg-blue-700 shadow shadow-blue-100"><Plus className="w-4 h-4" /> Nova Unidade</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6 bg-white rounded-xl max-h-[85vh] overflow-y-auto">
            <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Cadastrar Unidade de Saúde</DialogTitle>
            <form onSubmit={handleCadastro} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Nome da Unidade</Label><Input name="nome" required placeholder="Ex: UBS Central" /></div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Tipo</Label>
                  <select name="tipoInstituicao" required className="h-10 w-full border rounded-md px-3 bg-white text-sm">
                    <option value="UNIDADE">Unidade Básica (UBS)</option>
                    <option value="HOSPITAL">Hospital Geral</option>
                    <option value="POSTO">Posto de Saúde</option>
                    <option value="UPA">Pronto Atendimento (UPA)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Endereço</Label><Input name="endereco" placeholder="Rua, Bairro, Nº" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Telefone</Label><Input name="telefone" /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">E-mail</Label><Input name="email" type="email" /></div>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2"><Clock className="w-3.5 h-3.5 text-orange-500" /> Cronograma de Atendimento</span>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label className="text-xs">Seg a Sex</Label><Input name="horarioSegSex" placeholder="07h às 19h" /></div>
                  <div><Label className="text-xs">Sábados</Label><Input name="horarioSabado" placeholder="08h às 12h" /></div>
                  <div><Label className="text-xs">Domingos</Label><Input name="horarioDomingo" placeholder="Fechado" /></div>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 font-bold text-white h-11 shadow mt-4">Confirmar Cadastro</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[600px] p-6 bg-white rounded-xl">
          <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Editar Unidade</DialogTitle>
          {instituicaoEditando && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Nome</Label><Input name="nome" defaultValue={instituicaoEditando.nome} required /></div>
                <div className="grid gap-1.5">
                  <Label>Tipo</Label>
                  <select name="tipoInstituicao" defaultValue={instituicaoEditando.tipoInstituicao} className="h-10 w-full border bg-white px-3 text-sm">
                    <option value="UNIDADE">Unidade Básica (UBS)</option>
                    <option value="HOSPITAL">Hospital Geral</option>
                    <option value="POSTO">Posto de Saúde</option>
                    <option value="UPA">Pronto Atendimento (UPA)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-1.5"><Label>Endereço</Label><Input name="endereco" defaultValue={instituicaoEditando.endereco || ""} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Telefone</Label><Input name="telefone" defaultValue={instituicaoEditando.telefone || ""} /></div>
                <div className="grid gap-1.5"><Label>E-mail</Label><Input name="email" type="email" defaultValue={instituicaoEditando.email || ""} /></div>
              </div>
              <Button type="submit" className="w-full bg-amber-500 font-bold text-white h-11 mt-4 shadow">Salvar Modificações</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input placeholder="Procurar unidade ou endereço..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10 bg-white shadow-sm" />
      </div>

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
            {filtradas.map((i) => (
              <TableRow key={i.id} className="hover:bg-slate-50/40">
                <TableCell className="font-semibold text-slate-900">{i.nome}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${i.tipoInstituicao === 'HOSPITAL' ? 'bg-red-50 text-red-700 border border-red-100' : i.tipoInstituicao === 'UPA' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {i.tipoInstituicao}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-semibold space-y-0.5">
                  {i.telefone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {i.telefone}</div>}
                  {i.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {i.email}</div>}
                </TableCell>
                <TableCell className="text-slate-500 text-xs max-w-[200px] truncate"><div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {i.endereco || "-"}</div></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-28 border bg-white shadow-sm">
                      <DropdownMenuItem onClick={() => { setInstituicaoEditando(i); setOpenEdicao(true); }} className="gap-2 cursor-pointer text-amber-600 font-bold text-xs"><Edit2 className="w-3.5 h-3.5" /> Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
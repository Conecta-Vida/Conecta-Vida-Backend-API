import { useEffect, useState, useMemo } from "react";
import { Users, Search, Plus, FileText, Download, Upload, Trash2, Edit2, MoreHorizontal } from "lucide-react";
import { usuarioService, relatorioService, type Usuario } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  const carregarUsuarios = async () => {
    try {
      const dados = await usuarioService.listarTodos();
      setUsuarios(dados);
    } catch {
      toast.error("Erro ao conectar ao servidor para buscar usuários.");
    }
  };

  useEffect(() => { carregarUsuarios(); }, []);

  // useMemo: Otimiza a performance filtrando a lista na memória apenas quando o usuário digita na busca
  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return usuarios.filter(u => 
      u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    );
  }, [usuarios, busca]);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const novo: Usuario = {
      nome: f.get("nome") as string,
      email: f.get("email") as string,
      senha: f.get("senha") as string,
      idade: Number(f.get("idade")),
      sexo: f.get("sexo") as string,
      localizacao: f.get("localizacao") as string
    };

    try {
      await usuarioService.cadastrar(novo);
      toast.success("Usuário inserido com sucesso!");
      setOpenCadastro(false);
      carregarUsuarios();
    } catch {
      toast.error("Falha ao salvar dados.");
    }
  };

  const handleEdicao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioSelecionado?.id) return;
    const f = new FormData(e.currentTarget);
    const dados: Usuario = {
      nome: f.get("nome") as string,
      email: f.get("email") as string,
      idade: Number(f.get("idade")),
      sexo: f.get("sexo") as string,
      localizacao: f.get("localizacao") as string
    };

    try {
      await usuarioService.atualizar(usuarioSelecionado.id, dados);
      toast.success("Cadastro atualizado!");
      setOpenEdicao(false);
      carregarUsuarios();
    } catch {
      toast.error("Erro na atualização.");
    }
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Excluir permanentemente o usuário ${nome}?`)) return;
    try {
      await usuarioService.deletar(id);
      toast.success("Usuário removido da base.");
      carregarUsuarios();
    } catch {
      toast.error("Falha ao deletar.");
    }
  };

  const handleImportacaoCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const msg = await usuarioService.importarCsv(file);
      toast.success(msg);
      carregarUsuarios();
    } catch (err: any) {
      toast.error(err.message || "Erro na importação.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* CABEÇALHO DA TELA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900">
          <Users className="w-8 h-8 text-blue-600" /> Controle de Usuários
        </h1>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* BOTÕES DE ARQUIVOS */}
          <Button variant="outline" size="sm" onClick={() => relatorioService.downloadUsuariosPdf()} className="font-bold gap-1 text-slate-700">
            <FileText className="w-4 h-4 text-red-500" /> Exportar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => usuarioService.exportarCsv()} className="font-bold gap-1 text-slate-700">
            <Download className="w-4 h-4 text-emerald-600" /> Exportar CSV
          </Button>
          
          <label className="flex items-center gap-1 px-3 py-1.5 border border-input rounded-md text-sm font-bold bg-white cursor-pointer hover:bg-slate-50 text-slate-700 transition-all shadow-sm">
            <Upload className="w-4 h-4 text-blue-600" /> Importar CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImportacaoCsv} />
          </label>

          {/* MODAL CADASTRO */}
          <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1 font-bold shadow-md">
                <Plus className="w-4 h-4" /> Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
              <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Cadastrar Novo Cidadão</DialogTitle>
              <form onSubmit={handleCadastro} className="space-y-4 pt-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Nome Completo</Label><Input name="nome" required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">E-mail Único</Label><Input name="email" type="email" required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Senha Provisória</Label><Input name="senha" type="password" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Idade</Label><Input name="idade" type="number" /></div>
                  <div className="grid gap-1.5">
                    <Label className="font-bold text-slate-700">Sexo</Label>
                    <select name="sexo" className="h-10 w-full rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Cargo / Permissão do Sistema</Label><Input name="localizacao" placeholder="Ex: Usuário Comum, Administrador" /></div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white h-11 shadow mt-4">Salvar Registro</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* MODAL EDIÇÃO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
          <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Editar Usuário</DialogTitle>
          {usuarioSelecionado && (
            <form onSubmit={handleEdicao} className="space-y-4 pt-4">
              <div className="grid gap-1.5"><Label>Nome Completo</Label><Input name="nome" defaultValue={usuarioSelecionado.nome} required /></div>
              <div className="grid gap-1.5"><Label>E-mail</Label><Input name="email" type="email" defaultValue={usuarioSelecionado.email} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Idade</Label><Input name="idade" type="number" defaultValue={usuarioSelecionado.idade} /></div>
                <div className="grid gap-1.5">
                  <Label>Sexo</Label>
                  <select name="sexo" defaultValue={usuarioSelecionado.sexo} className="h-10 w-full rounded-md border bg-white px-3 text-sm">
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-1.5"><Label>Cargo / Permissão</Label><Input name="localizacao" defaultValue={usuarioSelecionado.localizacao} /></div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-white h-11 mt-4 shadow">Salvar Alterações</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* INPUT DE BUSCA */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input placeholder="Buscar cidadão por nome ou e-mail..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10 bg-white shadow-sm border-slate-200 focus-visible:ring-blue-600" />
      </div>

      {/* TABELA */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Nome</TableHead>
              <TableHead className="font-bold text-slate-700">E-mail</TableHead>
              <TableHead className="font-bold text-slate-700">Idade / Sexo</TableHead>
              <TableHead className="font-bold text-slate-700">Permissão</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/40">
                <TableCell className="font-semibold text-slate-900">{u.nome}</TableCell>
                <TableCell className="text-slate-500 font-medium">{u.email}</TableCell>
                <TableCell className="text-slate-500 text-xs font-semibold">{u.idade ? `${u.idade} anos` : "-"} / {u.sexo || "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.localizacao === 'Administrador' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                    {u.localizacao || "Usuário Comum"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-28 bg-white shadow-md rounded-md border">
                      <DropdownMenuItem onClick={() => { setUsuarioSelecionado(u); setOpenEdicao(true); }} className="gap-2 cursor-pointer text-amber-600 font-bold text-xs"><Edit2 className="w-3.5 h-3.5" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => u.id && handleDeletar(u.id, u.nome)} className="gap-2 cursor-pointer text-red-600 font-bold text-xs"><Trash2 className="w-3.5 h-3.5" /> Excluir</DropdownMenuItem>
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
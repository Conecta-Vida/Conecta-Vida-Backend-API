import { useEffect, useState, useMemo } from "react";
import { Users, Search, Plus, MoreHorizontal, Edit2, Trash2, Download, Mail, Lock, User, Hash } from "lucide-react";
import { type Usuario, usuarioService, relatorioService } from "../services/api";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [openCadastroAdmin, setOpenCadastroAdmin] = useState(false); // Estado para controlar o modal do Admin
  const [openEdicao, setOpenEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const carregarUsuarios = async () => {
    try {
      const dados = await usuarioService.listarTodos();
      setUsuarios(Array.isArray(dados) ? dados : []);
    } catch (error) {
      toast.error("Erro ao carregar lista de usuarios.");
    }
  };

  useEffect(() => { carregarUsuarios(); }, []);

  // Filtro de busca inteligente (pesquisa por ID, Nome ou E-mail)
  const usuariosFiltrados = useMemo(() => {
    const termo = (busca || "").toLowerCase();
    return usuarios.filter(u => {
      const nomeSeguro = u?.nome ? String(u.nome).toLowerCase() : "";
      const emailSeguro = u?.email ? String(u.email).toLowerCase() : "";
      const idSeguro = u?.id ? String(u.id) : "";
      return nomeSeguro.includes(termo) || emailSeguro.includes(termo) || idSeguro.includes(termo);
    });
  }, [usuarios, busca]);

  // FORMULÁRIO 1: Registo de Usuário Regular (Nome, Email, Senha)
  const handleCadastroRegular = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novo: Usuario = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      idade: undefined, 
      sexo: undefined,  
      localizacao: "Acesso Comum"
    };

    try {
      await usuarioService.cadastrar(novo);
      toast.success("Utilizador registado com sucesso!");
      setOpenCadastro(false);
      carregarUsuarios();
    } catch {
      toast.error("Erro ao tentar efetuar o registo.");
    }
  };

  // FORMULÁRIO 2: Registo de Administrador (Nome, Email, Senha)
  const handleCadastroAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novoAdmin: Usuario = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      idade: undefined,
      sexo: undefined,
      localizacao: "Administrador" // Identifica esta conta como nível de Admin no Supabase
    };

    try {
      await usuarioService.cadastrar(novoAdmin);
      toast.success("Administrador registado com sucesso!");
      setOpenCadastroAdmin(false);
      carregarUsuarios();
    } catch {
      toast.error("Erro ao tentar efetuar o registo do administrador.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioEditando?.id) return;

    const formData = new FormData(e.currentTarget);
    const dadosAtualizados: Usuario = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string || undefined,
      idade: formData.get("idade") ? Number(formData.get("idade")) : undefined,
      sexo: formData.get("sexo") as string,
      localizacao: formData.get("localizacao") as string,
    };

    try {
      await usuarioService.atualizar(usuarioEditando.id, dadosAtualizados);
      toast.success("Dados atualizados com sucesso!");
      setOpenEdicao(false);
      carregarUsuarios();
    } catch {
      toast.error("Erro ao atualizar dados.");
    }
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (!confirm(`Tem a certeza que deseja eliminar o utilizador ${nome}?`)) return;

    try {
      await usuarioService.deletar(id);
      toast.success("Utilizador removido.");
      carregarUsuarios();
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* SEÇÃO SUPERIOR: TÍTULO E AÇÕES */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" /> Usuarios
        </h1>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => relatorioService.downloadUsuariosPdf()} className="gap-2">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>

          {/* MODAL DE CADASTRO REGULAR */}
          <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 font-bold border-blue-200 text-blue-700 hover:bg-blue-50">
                <Plus className="w-4 h-4" /> Novo usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-none shadow-2xl sm:max-w-[450px]">
              <div className="bg-blue-600 p-6 text-white">
                <DialogTitle className="text-xl font-bold text-white">Registar Usuario</DialogTitle>
                <p className="text-blue-100 text-xs">Insira as credenciais básicas de acesso ao sistema.</p>
              </div>
              
              <form onSubmit={handleCadastroRegular} className="p-6 grid gap-4 bg-white">
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" /> Nome Completo
                  </Label>
                  <Input name="nome" required placeholder="Ex: Luiz Henrique" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" /> Endereço de E-mail
                  </Label>
                  <Input name="email" type="email" required placeholder="luizhe2004@gmail.com" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-400" /> Palavra-passe / Senha
                  </Label>
                  <Input name="senha" type="password" required placeholder="••••••••" minLength={6} className="bg-slate-50/50" />
                </div>
                <Button type="submit" className="w-full bg-blue-600 font-bold mt-2 h-11 text-white hover:bg-blue-700 transition-colors shadow">
                  Confirmar Registo
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* MODAL DE CADASTRO DO ADMINISTRADOR (AO LADO DO BOTÃO ANTERIOR) */}
          <Dialog open={openCadastroAdmin} onOpenChange={setOpenCadastroAdmin}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 gap-2 font-bold shadow-md hover:bg-slate-800 text-white">
                <Plus className="w-4 h-4" /> Novo Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-none shadow-2xl sm:max-w-[450px]">
              <div className="bg-slate-900 p-6 text-white">
                <DialogTitle className="text-xl font-bold text-white">Registar Administrador</DialogTitle>
                <p className="text-slate-400 text-xs">Crie uma credencial de acesso nível Admin com privilégios totais.</p>
              </div>
              
              <form onSubmit={handleCadastroAdmin} className="p-6 grid gap-4 bg-white">
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" /> Nome do Administrador
                  </Label>
                  <Input name="nome" required placeholder="Ex: Luiz Henrique Admin" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" /> E-mail Institucional
                  </Label>
                  <Input name="email" type="email" required placeholder="admin@conectavida.com" className="bg-slate-50/50" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-400" /> Senha Administrativa
                  </Label>
                  <Input name="senha" type="password" required placeholder="••••••••" minLength={6} className="bg-slate-50/50" />
                </div>
                <Button type="submit" className="w-full bg-slate-900 font-bold mt-2 h-11 text-white hover:bg-slate-800 transition-colors shadow">
                  Confirmar Registo Admin
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO AVANÇADA */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-amber-500 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white">Editar Perfil do Usuario</DialogTitle>
            <p className="text-amber-100 text-xs">Atualize ou complemente informações de cadastro.</p>
          </div>
          {usuarioEditando && (
            <form onSubmit={handleUpdate} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-2"><Label>Nome Completo</Label><Input name="nome" defaultValue={usuarioEditando.nome} required /></div>
              <div className="grid gap-2"><Label>E-mail</Label><Input name="email" type="email" defaultValue={usuarioEditando.email} required /></div>
              <div className="grid gap-2"><Label>Nova Palavra-passe (Opcional)</Label><Input name="senha" type="password" placeholder="Mantenha em branco se não quiser alterar" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Idade</Label><Input name="idade" type="number" defaultValue={usuarioEditando.idade || ""} /></div>
                <div className="grid gap-2"><Label>Sexo</Label><Input name="sexo" defaultValue={usuarioEditando.sexo || ""} placeholder="Ex: M / F" /></div>
              </div>
              <div className="grid gap-2"><Label>Localização</Label><Input name="localizacao" defaultValue={usuarioEditando.localizacao || ""} required /></div>
              <div className="flex gap-2 mt-2 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpenEdicao(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white">Atualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* FILTRO DE BUSCA */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Procurar por ID, nome ou e-mail..." 
          className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-600 shadow-sm" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
      </div>

      {/* TABELA DE EXIBIÇÃO EM TEMPO REAL */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px] font-bold text-slate-700 flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> ID</TableHead>
              <TableHead className="font-bold text-slate-700">Nome</TableHead>
              <TableHead className="font-bold text-slate-700">E-mail</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Idade</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/50">
                <TableCell className="font-mono text-xs font-bold text-slate-400">#{u.id}</TableCell>
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <span>{u.nome || "Sem Nome"}</span>
                    {/* Renderiza selo de identificação caso seja Administrador */}
                    {u.localizacao === "Administrador" && (
                      <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">{u.email || "-"}</TableCell>
                <TableCell className="text-center">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                    {u.idade || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => { setUsuarioEditando(u); setOpenEdicao(true); }} className="gap-2 cursor-pointer text-amber-600 font-medium">
                        <Edit2 className="w-4 h-4"/> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => u.id && handleExcluir(u.id, u.nome)} className="gap-2 text-red-600 cursor-pointer font-medium">
                        <Trash2 className="w-4 h-4"/> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {usuariosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400 italic">
                  Nenhum utilizador encontrado na base de dados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
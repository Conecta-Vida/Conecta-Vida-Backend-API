import { useEffect, useState, useMemo } from "react";
import { Users, Search, Plus, MoreHorizontal, Edit2, Trash2, Download } from "lucide-react";
import { type Usuario, usuarioService, relatorioService } from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// PARA A EQUIPE: Esta tela gerencia o CRUD (Criar, Ler, Atualizar, Deletar) de Usuários.
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const carregarUsuarios = async () => {
    try {
      const dados = await usuarioService.listarTodos();
      setUsuarios(dados);
    } catch (error) {
      toast.error("Erro ao carregar lista de utilizadores.");
    }
  };

  useEffect(() => { carregarUsuarios(); }, []);

  // PARA A EQUIPE: useMemo memoriza a lista filtrada. Se tivermos 5.000 usuários, 
  // ele só refaz o filtro se a variável 'busca' ou 'usuarios' mudar, deixando a tela super rápida.
  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return usuarios.filter(u => 
      u.nome.toLowerCase().includes(termo) || 
      u.email.toLowerCase().includes(termo)
    );
  }, [usuarios, busca]);

  // Função disparada ao enviar o formulário de NOVO usuário
  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // Pega todos os inputs do form magicamente
    const novo: Usuario = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      idade: Number(formData.get("idade")),
      sexo: formData.get("sexo") as string,
      localizacao: formData.get("localizacao") as string,
    };

    try {
      await usuarioService.cadastrar(novo);
      toast.success("Utilizador registado com sucesso!");
      setOpenCadastro(false);
      carregarUsuarios(); // Atualiza a tabela chamando a API de novo
    } catch {
      toast.error("Erro ao registar.");
    }
  };

  // Função disparada ao enviar o formulário de EDIÇÃO
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioEditando?.id) return;

    const formData = new FormData(e.currentTarget);
    const dadosAtualizados: Usuario = {
      nome: formData.get("nome") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      idade: Number(formData.get("idade")),
      sexo: formData.get("sexo") as string,
      localizacao: formData.get("localizacao") as string,
    };

    try {
      await usuarioService.atualizar(usuarioEditando.id, dadosAtualizados);
      toast.success("Dados atualizados!");
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" /> Utilizadores
        </h1>
        
        <div className="flex gap-2">
          {/* Chama a geração de PDF no backend */}
          <Button variant="outline" onClick={() => relatorioService.downloadUsuariosPdf()} className="gap-2">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>

          {/* Modal de Cadastro */}
          <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Novo Utilizador</Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-blue-600 p-6 text-white">
                <DialogTitle className="text-xl font-bold text-white">Registar Utilizador</DialogTitle>
                <p className="text-blue-100 text-xs">Adicione um novo utilizador ao sistema.</p>
              </div>
              <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white">
                <div className="grid gap-2"><Label>Nome Completo</Label><Input name="nome" required /></div>
                <div className="grid gap-2"><Label>E-mail</Label><Input name="email" type="email" required /></div>
                <div className="grid gap-2"><Label>Palavra-passe</Label><Input name="senha" type="password" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Idade</Label><Input name="idade" type="number" required /></div>
                  <div className="grid gap-2"><Label>Sexo</Label><Input name="sexo" /></div>
                </div>
                <div className="grid gap-2"><Label>Localização</Label><Input name="localizacao" placeholder="Ex: Lisboa" required /></div>
                <Button type="submit" className="w-full bg-blue-600 font-bold mt-2">Guardar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modal de Edição (Abre quando o usuário clica em Editar na tabela) */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-amber-500 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white">Editar Utilizador</DialogTitle>
            <p className="text-amber-500 text-xs">Altere as informações de registo.</p>
          </div>
          {usuarioEditando && (
            <form onSubmit={handleUpdate} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input name="nome" defaultValue={usuarioEditando.nome} required />
              </div>
              <div className="grid gap-2">
                <Label>E-mail</Label>
                <Input name="email" type="email" defaultValue={usuarioEditando.email} required />
              </div>
              <div className="grid gap-2">
                <Label>Palavra-passe</Label>
                <Input name="senha" type="password" defaultValue={usuarioEditando.senha} placeholder="Digite para atualizar" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Idade</Label>
                  <Input name="idade" type="number" defaultValue={usuarioEditando.idade} required />
                </div>
                <div className="grid gap-2">
                  <Label>Sexo</Label>
                  <Input name="sexo" defaultValue={usuarioEditando.sexo} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Localização</Label>
                <Input name="localizacao" defaultValue={usuarioEditando.localizacao} required />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setOpenEdicao(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold">Atualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Procurar por nome ou e-mail..." 
          className="pl-10 bg-white" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Nome</TableHead>
              <TableHead className="font-bold">E-mail</TableHead>
              <TableHead className="text-center font-bold">Idade</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {/* Renderiza a lista filtrada pelo useMemo ao invés da lista bruta */}
            {usuariosFiltrados.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium text-slate-900">{u.nome}</TableCell>
                <TableCell className="text-slate-500">{u.email}</TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                    {u.idade || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setUsuarioEditando(u); setOpenEdicao(true); }} className="gap-2 cursor-pointer">
                        <Edit2 className="w-4 h-4 text-amber-500"/> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => u.id && handleExcluir(u.id, u.nome)} className="gap-2 text-red-600 cursor-pointer">
                        <Trash2 className="w-4 h-4"/> Excluir
                      </DropdownMenuItem>
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
import { useEffect, useState, useMemo } from "react";
import { Users, FileText, Download, Upload, Plus, MoreHorizontal, Edit2, Trash2, UserCheck, MapPin } from "lucide-react";
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
  const [openEdicao, setOpenEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  const carregarUsuarios = async () => {
    try {
      const dados = await usuarioService.listarTodos();
      setUsuarios(dados);
    } catch {
      toast.error("Erro ao carregar a lista de cidadãos.");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Filtragem inteligente em memória via useMemo (busca por nome, e-mail ou cidade)
  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo) ||
        (u.localizacao && u.localizacao.toLowerCase().includes(termo))
    );
  }, [usuarios, busca]);

  // Handler para Criar Novo Usuário / Administrador
  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    
    const novo: any = {
      nome: f.get("nome") as string,
      email: f.get("email") as string,
      senha: (f.get("senha") as string) || "123456", // Senha padrão caso vazio
      idade: f.get("idade") ? Number(f.get("idade")) : undefined, // CORRIGIDO: de 'idado' para 'idade'
      sexo: (f.get("sexo") as string) || undefined,
      localizacao: f.get("localizacao") as string, // Armazena a Cidade do Cidadão
      permissao: f.get("permissao") as string,     // Armazena se é Administrador ou Usuário Comum
    };

    try {
      await usuarioService.cadastrar(novo);
      toast.success("Registro criado com sucesso!");
      setOpenCadastro(false);
      carregarUsuarios();
    } catch {
      toast.error("Falha ao salvar o novo registro.");
    }
  };

  // Handler para Atualizar Usuário / Administrador existente
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usuarioEditando?.id) return;
    const f = new FormData(e.currentTarget);

    const dados: any = {
      nome: f.get("nome") as string,
      email: f.get("email") as string,
      idade: f.get("idade") ? Number(f.get("idade")) : undefined,
      sexo: (f.get("sexo") as string) || undefined,
      localizacao: f.get("localizacao") as string, // Atualiza Cidade
      permissao: f.get("permissao") as string,     // Atualiza Permissão
    };

    try {
      await usuarioService.atualizar(usuarioEditando.id, dados);
      toast.success("Dados updated com sucesso!");
      setOpenEdicao(false);
      carregarUsuarios();
    } catch {
      toast.error("Erro na atualização dos dados.");
    }
  };

  // Handler para Remover Registro
  const handleDeletar = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este registro do sistema?")) return;
    try {
      await usuarioService.deletar(id);
      toast.success("Registro removido.");
      carregarUsuarios();
    } catch {
      toast.error("Não foi possível deletar o usuário.");
    }
  };

  // Handler para Importação em Lote de Planilha CSV
  const handleImportarCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const msg = await usuarioService.importarCsv(file);
      toast.success(msg || "Carga de dados processada com sucesso!");
      carregarUsuarios();
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar o arquivo CSV.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* CABEÇALHO DA VIEW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900">
          <Users className="w-8 h-8 text-blue-600" /> Controle de Usuários
        </h1>
        
        {/* GRUPO DE BOTÕES DE AÇÃO */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={relatorioService.downloadUsuariosPdf} className="font-bold text-slate-700 gap-1.5 border-slate-200 bg-white">
            <FileText className="w-4 h-4 text-red-500" /> Exportar PDF
          </Button>
          
          <Button variant="outline" onClick={usuarioService.exportarCsv} className="font-bold text-slate-700 gap-1.5 border-slate-200 bg-white">
            <Download className="w-4 h-4 text-emerald-600" /> Exportar CSV
          </Button>

          <label className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 gap-1.5">
            <Upload className="w-4 h-4 text-blue-600" /> Importar CSV
            <input type="file" accept=".csv" onChange={handleImportarCsv} className="hidden" />
          </label>

          {/* MODAL DE CADASTRO */}
          <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 font-bold hover:bg-blue-700 shadow-sm gap-1">
                <Plus className="w-4 h-4" /> Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
              <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Cadastrar Usuário ou Administrador
              </DialogTitle>
              <form onSubmit={handleCadastro} className="space-y-4 pt-4">
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Nome Completo</Label>
                  <Input name="nome" required placeholder="Ex: Luiz Henrique" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">E-mail Institucional</Label>
                  <Input name="email" type="email" required placeholder="exemplo@conecta.com" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Senha de Acesso</Label>
                  <Input name="senha" type="password" placeholder="Defina uma senha (Padrão: 123456)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="font-bold text-slate-700">Idade</Label>
                    <Input name="idade" type="number" placeholder="Ex: 22" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="font-bold text-slate-700">Gênero / Sexo</Label>
                    <Input name="sexo" placeholder="Ex: Masculino" />
                  </div>
                </div>
                
                {/* NOVO CAMPO: Cidade Residencial (Mapeado para localizacao) */}
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Cidade (Filtro Feed Mobile)</Label>
                  <Input name="localizacao" required placeholder="Ex: Bragança Paulista" />
                </div>

                {/* CAMPO ALTERADO: Nível de Permissão (Mapeado para permissao) */}
                <div className="grid gap-1.5">
                  <Label className="font-bold text-slate-700">Nível de Permissão (Cargo)</Label>
                  <select name="permissao" required className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-600">
                    <option value="Usuário Comum">Usuário Comum (Cidadão)</option>
                    <option value="Administrador">Administrador (Gestor de Saúde)</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 font-bold text-white h-11 shadow mt-4">
                  Salvar Registro no Banco
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <Input
          placeholder="Buscar cidadão por nome, e-mail ou cidade de cadastro..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-white shadow-sm pl-4 h-11"
        />
      </div>

      {/* TABELA DE LISTAGEM */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white rounded-xl">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-bold text-slate-600 px-6 py-4">Nome</TableHead>
              <TableHead className="font-bold text-slate-600 px-6 py-4">E-mail</TableHead>
              <TableHead className="font-bold text-slate-600 px-6 py-4">Idade / Sexo</TableHead>
              <TableHead className="font-bold text-slate-600 px-6 py-4">Cidade (Mobile)</TableHead>
              <TableHead className="font-bold text-slate-600 px-6 py-4">Permissão</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-none">
                <TableCell className="font-semibold text-slate-900 px-6 py-4">{u.nome}</TableCell>
                <TableCell className="text-slate-600 font-medium px-6 py-4">{u.email}</TableCell>
                <TableCell className="text-slate-500 font-medium px-6 py-4">
                  {u.idade ? `${u.idade} anos` : "-"} / {u.sexo || "-"}
                </TableCell>
                
                {/* RENDERIZAÇÃO DA CIDADE DO USUÁRIO */}
                <TableCell className="text-slate-600 font-semibold px-6 py-4 flex items-center gap-1.5 mt-1.5 border-none">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {u.localizacao || "-"}
                </TableCell>
                
                {/* RENDERIZAÇÃO CORRETA DO BADGE VIA PROPRIEDADE u.permissao */}
                <TableCell className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                    u.permissao === 'Administrador' || u.permissao === 'ADMINISTRADOR'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {u.permissao || "Usuário Comum"}
                  </span>
                </TableCell>
                
                <TableCell className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 border bg-white shadow-md rounded-lg">
                      <DropdownMenuItem onClick={() => { setUsuarioEditando(u); setOpenEdicao(true); }} className="gap-2 cursor-pointer font-bold text-xs text-amber-600">
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => u.id && handleDeletar(u.id)} className="gap-2 cursor-pointer font-bold text-xs text-red-600">
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400 italic">
                  Nenhum cidadão ou administrador localizado na base de dados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
          <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Editar Dados de Registro</DialogTitle>
          {usuarioEditando && (
            <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Nome Completo</Label><Input name="nome" defaultValue={usuarioEditando.nome} required /></div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">E-mail</Label><Input name="email" type="email" defaultValue={usuarioEditando.email} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Idade</Label><Input name="idade" type="number" defaultValue={usuarioEditando.idade || ""} /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Gênero</Label><Input name="sexo" defaultValue={usuarioEditando.sexo || ""} /></div>
              </div>
              
              {/* CAMPO DE EDIÇÃO DE CIDADE */}
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Cidade (Filtro Feed Mobile)</Label>
                <Input name="localizacao" defaultValue={usuarioEditando.localizacao || ""} required />
              </div>

              {/* CAMPO DE EDIÇÃO DE CARGO */}
              <div className="grid gap-1.5">
                <Label className="font-bold text-slate-700">Nível de Permissão (Cargo)</Label>
                <select name="permissao" defaultValue={usuarioEditando.permissao || "Usuário Comum"} className="h-10 w-full border rounded-md px-3 bg-white text-sm font-semibold">
                  <option value="Usuário Comum">Usuário Comum (Cidadão)</option>
                  <option value="Administrador">Administrador (Gestor de Saúde)</option>
                </select>
              </div>
              
              <Button type="submit" className="w-full bg-amber-500 font-bold text-white h-11 mt-4 shadow">
                Salvar Alterações
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
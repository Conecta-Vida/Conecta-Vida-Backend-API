import { useEffect, useState } from "react";
import { Users, Search, Plus, MoreHorizontal, Edit2, Trash2, Download } from "lucide-react";
import { type Paciente, pacienteService, relatorioService } from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openEdicao, setOpenEdicao] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);

  const carregarPacientes = async () => {
    try {
      const dados = await pacienteService.listarTodos();
      setPacientes(dados);
    } catch (error) {
      toast.error("Erro ao carregar lista de pacientes.");
    }
  };

  useEffect(() => { carregarPacientes(); }, []);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const novo = {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      dataNascimento: formData.get("data") as string,
      tipagemSanguinea: formData.get("sangue") as string,
    };

    try {
      await pacienteService.cadastrar(novo);
      toast.success("Paciente cadastrado com sucesso!");
      setOpenCadastro(false);
      carregarPacientes();
    } catch {
      toast.error("Erro ao cadastrar.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pacienteEditando?.id) return;

    const formData = new FormData(e.currentTarget);
    const dadosAtualizados = {
      nome: formData.get("nome") as string,
      cpf: formData.get("cpf") as string,
      dataNascimento: formData.get("data") as string,
      tipagemSanguinea: formData.get("sangue") as string,
    };

    try {
      await pacienteService.atualizar(pacienteEditando.id, dadosAtualizados);
      toast.success("Dados atualizados!");
      setOpenEdicao(false);
      carregarPacientes();
    } catch {
      toast.error("Erro ao atualizar dados.");
    }
  };

  const handleExcluir = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o paciente ${nome}?`)) return;

    try {
      await pacienteService.deletar(id);
      toast.success("Paciente removido.");
      carregarPacientes();
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" /> Pacientes
        </h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => relatorioService.downloadPacientesPdf()} className="gap-2">
            <Download className="w-4 h-4" /> Exportar PDF
          </Button>

          <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 gap-2 font-bold"><Plus className="w-4 h-4" /> Novo Paciente</Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-blue-600 p-6 text-white">
                <DialogTitle className="text-xl font-bold text-white">Cadastrar Cidadão</DialogTitle>
                <p className="text-blue-100 text-xs">Registe um novo paciente no sistema nacional.</p>
              </div>
              <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white">
                <div className="grid gap-2"><Label>Nome Completo</Label><Input name="nome" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>CPF</Label><Input name="cpf" required /></div>
                  <div className="grid gap-2"><Label>Tipo Sanguíneo</Label><Input name="sangue" /></div>
                </div>
                <div className="grid gap-2"><Label>Data de Nascimento</Label><Input name="data" type="date" required /></div>
                <Button type="submit" className="w-full bg-blue-600 font-bold mt-2">Salvar Paciente</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      <Dialog open={openEdicao} onOpenChange={setOpenEdicao}>
        <DialogContent className="p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-amber-500 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white">Editar Paciente</DialogTitle>
            <p className="text-amber-500 text-xs">Altere as informações do registo.</p>
          </div>
          {pacienteEditando && (
            <form onSubmit={handleUpdate} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-2">
                <Label>Nome Completo</Label>
                <Input name="nome" defaultValue={pacienteEditando.nome} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>CPF</Label>
                  <Input name="cpf" defaultValue={pacienteEditando.cpf} required />
                </div>
                <div className="grid gap-2">
                  <Label>Tipo Sanguíneo</Label>
                  <Input name="sangue" defaultValue={pacienteEditando.tipagemSanguinea} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Data de Nascimento</Label>
                <Input name="data" type="date" defaultValue={pacienteEditando.dataNascimento} required />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setOpenEdicao(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold">Atualizar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Procurar por nome ou CPF..." 
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
              <TableHead className="font-bold">CPF</TableHead>
              <TableHead className="text-center font-bold">Tipo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {pacientes.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cpf.includes(busca)).map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-slate-900">{p.nome}</TableCell>
                <TableCell className="text-slate-500">{p.cpf}</TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold">
                    {p.tipagemSanguinea || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setPacienteEditando(p); setOpenEdicao(true); }} className="gap-2 cursor-pointer">
                        <Edit2 className="w-4 h-4 text-amber-500"/> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => p.id && handleExcluir(p.id, p.nome)} className="gap-2 text-red-600 cursor-pointer">
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
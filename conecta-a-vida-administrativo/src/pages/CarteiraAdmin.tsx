import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Syringe, 
  Filter, 
  Download, 
  History, 
  User as UserIcon,
  CheckCircle2
} from "lucide-react";
import { 
  type Paciente, 
  type RegistroVacinacaoDetalhado, 
  type Vacina, 
  pacienteService, 
  registroVacinacaoService, 
  vacinaService 
} from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function CarteiraAdmin() {
  const [busca, setBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [registros, setRegistros] = useState<RegistroVacinacaoDetalhado[]>([]);
  const [vacinasDisponiveis, setVacinasDisponiveis] = useState<Vacina[]>([]);
  const [openNovaDose, setOpenNovaDose] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarVacinas = async () => {
      try {
        const dados = await vacinaService.listarTodas();
        setVacinasDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao carregar lista de vacinas");
      }
    };
    carregarVacinas();
  }, []);

  const buscarPaciente = async () => {
    if (busca.length < 11) {
      toast.error("Insira um CPF válido");
      return;
    }
    setLoading(true);
    try {
      const todos = await pacienteService.listarTodos();
      const encontrado = todos.find(p => p.cpf.replace(/\D/g, "") === busca.replace(/\D/g, ""));
      if (encontrado && encontrado.id) {
        setPacienteSelecionado(encontrado);
        const historico = await registroVacinacaoService.listarPorPaciente(encontrado.id);
        setRegistros(historico);
        toast.success("Paciente localizado!");
      } else {
        toast.error("Paciente não encontrado.");
        setPacienteSelecionado(null);
      }
    } catch (error) {
      toast.error("Erro na API.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarDose = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pacienteSelecionado || !pacienteSelecionado.id) return;
    const formData = new FormData(e.currentTarget);
    const novoRegistro = {
      paciente: { id: pacienteSelecionado.id },
      vacina: { id: Number(formData.get("vacinaId")) },
      dataAplicacao: formData.get("data") as string,
      lote: formData.get("lote") as string,
      profissionalSaude: formData.get("profissional") as string,
    };
    try {
      await registroVacinacaoService.registrar(novoRegistro);
      toast.success("Dose registada!");
      setOpenNovaDose(false);
      const historico = await registroVacinacaoService.listarPorPaciente(pacienteSelecionado.id);
      setRegistros(historico);
    } catch (error) {
      toast.error("Erro ao registar dose.");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Administração de Carteiras</h1>
        <p className="text-slate-500">Consulte o histórico e realize o lançamento oficial de doses.</p>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="busca-cpf" className="text-slate-600 font-semibold">CPF do Cidadão</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="busca-cpf" placeholder="000.000.000-00" className="pl-10 h-12 text-lg" value={busca} onChange={(e) => setBusca(e.target.value)} />
              </div>
            </div>
            <Button onClick={buscarPaciente} disabled={loading} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 gap-2 text-base font-bold shadow-md shadow-blue-100">
              {loading ? "Buscando..." : "Consultar Carteira"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {pacienteSelecionado ? (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-sm bg-slate-50 border-l-4 border-l-blue-600">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><UserIcon className="w-8 h-8" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{pacienteSelecionado.nome}</h2>
                  <p className="text-slate-500 font-medium">CPF: {pacienteSelecionado.cpf}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Dialog open={openNovaDose} onOpenChange={setOpenNovaDose}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 gap-2 font-bold"><Plus className="w-4 h-4" /> Registar Nova Dose</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Lançamento de Vacinação</DialogTitle></DialogHeader>
                    <form onSubmit={handleRegistrarDose} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Vacina</Label>
                        <select name="vacinaId" required className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600">
                          <option value="">Selecione...</option>
                          {vacinasDisponiveis.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2"><Label>Data</Label><Input name="data" type="date" required defaultValue={new Date().toISOString().split('T')[0]} /></div>
                        <div className="grid gap-2"><Label>Lote</Label><Input name="lote" required /></div>
                      </div>
                      <div className="grid gap-2"><Label>Profissional</Label><Input name="profissional" required /></div>
                      <Button type="submit" className="w-full bg-blue-600 mt-2">Confirmar Registo</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100"><CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-blue-600" /> Histórico de Imunização</CardTitle></CardHeader>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Vacina</TableHead>
                  <TableHead className="font-bold">Data</TableHead>
                  <TableHead className="font-bold">Lote</TableHead>
                  <TableHead className="font-bold text-right text-blue-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {registros.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-32 text-center text-slate-400">Nenhum registo encontrado.</TableCell></TableRow>
                ) : (
                  registros.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-bold">{r.vacina.nome}</TableCell>
                      <TableCell>{new Date(r.dataAplicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                      <TableCell>{r.lote}</TableCell>
                      <TableCell className="text-right text-green-600 font-bold text-xs"><CheckCircle2 className="w-4 h-4 inline mr-1" /> APLICADA</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
          <Search className="w-10 h-10 text-slate-300 mb-6" />
          <h3 className="text-xl font-bold text-slate-900">Aguardando Consulta</h3>
          <p className="text-slate-500 mt-2">Digite o CPF para visualizar o histórico.</p>
        </div>
      )}
    </div>
  );
}
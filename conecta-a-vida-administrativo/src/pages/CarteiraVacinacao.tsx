import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  Syringe
} from "lucide-react";
import { 
  type Paciente, 
  type RegistroVacinacaoDetalhado, 
  type Vacina, 
  pacienteService, 
  registroVacinacaoService, 
  vacinaService 
} from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Calendário Oficial PNI Brasil
const PNI_CALENDARIO = [
  { idade: "Ao Nascer", vacinas: ["BCG", "Hepatite B"] },
  { idade: "2 Meses", vacinas: ["Pentavalente", "Poliomielite (VIP)", "Pneumocócica 10V", "Rotavírus"] },
  { idade: "3 Meses", vacinas: ["Meningocócica C"] },
  { idade: "4 Meses", vacinas: ["Pentavalente (2ª)", "Poliomielite (VIP) (2ª)", "Pneumocócica 10V (2ª)", "Rotavírus (2ª)"] },
  { idade: "9 Meses", vacinas: ["Febre Amarela"] },
  { idade: "12 Meses", vacinas: ["Tríplice Viral", "Pneumocócica 10V (Reforço)", "Meningocócica C (Reforço)"] },
  { idade: "Adulto", vacinas: ["Dupla Adulto (dT)", "Hepatite B (3 doses)", "Febre Amarela", "Tríplice Viral"] },
];

export default function CarteiraVacinacao() {
  const [busca, setBusca] = useState("");
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historico, setHistorico] = useState<RegistroVacinacaoDetalhado[]>([]);
  const [vacinasDB, setVacinasDB] = useState<Vacina[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    vacinaService.listarTodas().then(setVacinasDB).catch(console.error);
  }, []);

  const buscarCidadao = async () => {
    try {
      const todos = await pacienteService.listarTodos();
      
      // Proteção: Garante que 'todos' é um array antes de buscar
      if (!Array.isArray(todos)) {
        toast.error("Erro interno: A lista de pacientes não é válida.");
        return;
      }

      const p = todos.find(x => x.cpf.replace(/\D/g, "") === busca.replace(/\D/g, ""));
      
      if (p?.id) {
        setPaciente(p);
        const h = await registroVacinacaoService.listarPorPaciente(p.id);
        
        // Proteção: Garante que o histórico é sempre um array para evitar o crash
        setHistorico(Array.isArray(h) ? h : []);
        toast.success("Carteira do cidadão carregada!");
      } else {
        setPaciente(null); // Limpa o estado se não encontrar
        toast.error("Cidadão não encontrado no sistema.");
      }
    } catch (e) {
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  const handleLancarVacina = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paciente?.id) return;

    const f = new FormData(e.currentTarget);
    const dados = {
      paciente: { id: paciente.id },
      vacina: { id: Number(f.get("vacinaId")) },
      dataAplicacao: f.get("data") as string,
      lote: f.get("lote") as string,
      profissionalSaude: f.get("profissional") as string,
    };

    try {
      await registroVacinacaoService.registrar(dados);
      toast.success("Vacina registrada com sucesso!");
      setOpenAdd(false);
      buscarCidadao(); // Recarrega para atualizar os checks
    } catch (e) {
      toast.error("Erro ao registrar vacina.");
    }
  };

  const verificarStatus = (nomeVacinaPni: string) => {
  // Proteção: Adicionado o ?. para evitar erro se houver dados incompletos
  return historico.find(h => 
    h.vacina?.nome?.toLowerCase().includes(nomeVacinaPni.toLowerCase().split(" ")[0])
  );
};

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Syringe className="w-8 h-8 text-blue-600" /> Cartela de Vacinação PNI
        </h1>
        <p className="text-slate-500 font-medium">Controle de imunização baseada no calendário obrigatório brasileiro.</p>
      </div>

      {/* Busca por CPF */}
      <Card className="border-none shadow-sm bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-blue-900 font-bold">Consultar por CPF</Label>
              <Input 
                placeholder="000.000.000-00" 
                value={busca} 
                onChange={e => setBusca(e.target.value)} 
                className="h-12 text-lg bg-white" 
              />
            </div>
            <Button onClick={buscarCidadao} className="h-12 px-10 bg-blue-600 hover:bg-blue-700 font-bold gap-2 shadow-md">
              <Search className="w-5 h-5" /> Buscar Carteira
            </Button>
          </div>
        </CardContent>
      </Card>

      {paciente && (
        <div className="space-y-6">
          {/* Resumo do Paciente */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                {paciente.nome[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{paciente.nome}</h2>
                <div className="flex gap-3 mt-1">
                  <Badge variant="secondary" className="font-mono">{paciente.cpf}</Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">Sangue: {paciente.tipagemSanguinea || '?'}</Badge>
                </div>
              </div>
            </div>

            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 gap-2 font-bold shadow-lg shadow-green-100">
                  <Plus className="w-4 h-4" /> Registrar Aplicação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle className="text-2xl font-bold text-slate-900">Nova Vacina</DialogTitle></DialogHeader>
                <form onSubmit={handleLancarVacina} className="grid gap-5 py-4">
                  <div className="grid gap-2">
                    <Label>Selecione a Vacina</Label>
                    <select name="vacinaId" className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" required>
                      <option value="">Selecione uma vacina do estoque...</option>
                      {vacinasDB.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Data de Aplicação</Label>
                      <Input name="data" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Lote</Label>
                      <Input name="lote" required placeholder="Ex: BN9021" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Profissional Responsável</Label>
                    <Input name="profissional" required placeholder="Nome do enfermeiro(a)" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 h-11 text-lg font-bold">Salvar na Cartela</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Cartão de Vacinação Estilo PNI */}
          <div className="grid gap-6">
            <div className="flex items-center gap-2 px-1">
              <Filter className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Calendário Nacional de Imunização</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PNI_CALENDARIO.map((periodo, idx) => (
                <Card key={idx} className="border-none shadow-sm overflow-hidden border-t-4 border-t-blue-500">
                  <CardHeader className="bg-slate-50 py-3">
                    <CardTitle className="text-base font-black text-blue-900">{periodo.idade}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {periodo.vacinas.map((vac, vIdx) => {
                        const dose = verificarStatus(vac);
                        return (
                          <div key={vIdx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              {dose ? (
                                <div className="p-2 bg-green-100 rounded-full text-green-600">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="p-2 bg-slate-100 rounded-full text-slate-300">
                                  <Clock className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <p className={`text-sm font-bold ${dose ? 'text-slate-900' : 'text-slate-500'}`}>{vac}</p>
                                {dose && (
                                  <p className="text-[10px] text-green-600 font-bold uppercase">
                                    Aplicada em {new Date(dose.dataAplicacao).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!dose && (
                              <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-600 bg-amber-50">Pendente</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {!paciente && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nenhum cidadão selecionado</h3>
          <p className="text-slate-500 max-w-xs text-center mt-2">
            Utilize o campo de busca acima para carregar a cartela de vacinação obrigatória.
          </p>
        </div>
      )}
    </div>
  );
}
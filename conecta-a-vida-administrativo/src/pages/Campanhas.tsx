import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Plus, Calendar, Users, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Campanha, campanhaService } from "../services/api";
import { toast } from "sonner";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCadastro, setOpenCadastro] = useState(false);

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

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novaCampanha: Campanha = {
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
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
        
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
              <Plus className="w-4 h-4" /> Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-none p-0 overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg"><Megaphone className="w-6 h-6 text-white" /></div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Lançar Nova Campanha</DialogTitle>
                  <p className="text-emerald-100 text-xs">Divulgue uma nova ação de saúde comunitária.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCadastro} className="p-6 grid gap-4 bg-white">
              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Título da Campanha</Label><Input name="titulo" required /></div>
              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Descrição</Label><Textarea name="descricao" className="resize-none h-24" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label className="text-slate-700 font-bold">Início</Label><Input name="inicio" type="date" required /></div>
                <div className="grid gap-2"><Label className="text-slate-700 font-bold">Término</Label><Input name="fim" type="date" required /></div>
              </div>
              <div className="grid gap-2"><Label className="text-slate-700 font-bold">Público-Alvo</Label><Input name="publico" required /></div>
              
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpenCadastro(false)} className="flex-1 font-bold">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold">Salvar e Publicar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Megaphone className="w-5 h-5 text-purple-600" />
                  </div>
                  {getStatusBadge(campanha.status)}
                </div>
                <Link to={`/campanhas/${campanha.id}`}>
                  <CardTitle className="text-xl mt-4 text-slate-800 hover:text-blue-600 cursor-pointer transition-colors">
                    {campanha.titulo}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-500 line-clamp-2">{campanha.descricao}</p>
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Público:</span><span className="font-semibold text-slate-700">{campanha.publicoAlvo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{campanha.dataInicio ? new Date(campanha.dataInicio).toLocaleDateString() : ""} - {campanha.dataFim ? new Date(campanha.dataFim).toLocaleDateString() : ""}</span>
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Plus, Search, Calendar, Award } from "lucide-react";
import { campanhaService, type Campanha } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [busca, setBusca] = useState("");
  const [openCadastro, setOpenCadastro] = useState(false);

  const carregarCampanhas = async () => {
    try {
      const dados = await campanhaService.listarTodas();
      setCampanhas(dados);
    } catch {
      toast.error("Erro ao buscar campanhas de saúde.");
    }
  };

  useEffect(() => { carregarCampanhas(); }, []);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nova: Campanha = {
      titulo: f.get("titulo") as string,
      descricao: f.get("descricao") as string,
      categoria: f.get("categoria") as string,
      publicoAlvo: f.get("publicoAlvo") as string,
      status: "Ativa",
      dataInicio: new Date(f.get("dataInicio") as string).toISOString(),
      dataFim: new Date(f.get("dataFim") as string).toISOString(),
      linkimagem: f.get("linkimagem") as string || undefined,
      localizacao: f.get("localizacao") as string || undefined
    };

    try {
      await campanhaService.cadastrar(nova);
      toast.success("Campanha de utilidade pública lançada!");
      setOpenCadastro(false);
      carregarCampanhas();
    } catch {
      toast.error("Erro ao publicar campanha.");
    }
  };

  const filtradas = campanhas.filter(c => c.titulo.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black flex items-center gap-2 text-slate-900"><Megaphone className="w-8 h-8 text-blue-600" /> Campanhas Ativas</h1>
        
        <Dialog open={openCadastro} onOpenChange={setOpenCadastro}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 font-bold hover:bg-blue-700 shadow shadow-blue-100"><Plus className="w-4 h-4" /> Lançar Campanha</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-xl">
            <DialogTitle className="text-xl font-black text-slate-900 border-b pb-3">Criar Campanha Comunitária</DialogTitle>
            <form onSubmit={handleCadastro} className="space-y-4 pt-3">
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Título</Label><Input name="titulo" required /></div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Descrição Detalhada</Label><textarea name="descricao" required className="w-full min-h-[80px] border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Público-Alvo</Label><Input name="publicoAlvo" placeholder="Ex: Gestantes" required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Categoria</Label><Input name="categoria" placeholder="Ex: Vacinação" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data Início</Label><Input name="dataInicio" type="date" required /></div>
                <div className="grid gap-1.5"><Label className="font-bold text-slate-700">Data Término</Label><Input name="dataFim" type="date" required /></div>
              </div>
              <div className="grid gap-1.5"><Label className="font-bold text-slate-700">URL Imagem Divulgação</Label><Input name="linkimagem" placeholder="https://..." /></div>
              <Button type="submit" className="w-full bg-blue-600 font-bold text-white h-11 shadow mt-4">Publicar no App</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input placeholder="Buscar por título da campanha de saúde..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10 bg-white" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtradas.map((c) => (
          <Card key={c.id} className="border-none shadow-sm bg-white overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-4 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded w-max">{c.categoria || "Geral"}</span>
              <CardTitle className="text-base font-black text-slate-900 pt-2 truncate">{c.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.descricao}</p>
              <div className="space-y-1 text-[11px] text-slate-400 font-bold">
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(c.dataInicio).toLocaleDateString()} até {new Date(c.dataFim).toLocaleDateString()}</div>
                <div className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-blue-500" /> Foco: {c.publicoAlvo}</div>
              </div>
              {c.id && <Link to={`/campanhas/${c.id}`} className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2 rounded-md border border-slate-200/60 transition-colors">Gerenciar Campanha</Link>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
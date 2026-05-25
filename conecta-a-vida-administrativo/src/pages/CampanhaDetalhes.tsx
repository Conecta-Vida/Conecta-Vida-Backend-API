import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Users, Calendar, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Campanha, campanhaService } from "../services/api";
import { toast } from "sonner";

export default function CampanhaDetalhes() {
  const { id } = useParams();
  const [campanha, setCampanha] = useState<Campanha | null>(null);

  useEffect(() => {
    if (id) {
      campanhaService.buscarPorId(Number(id))
        .then(setCampanha)
        .catch(() => toast.error("Campanha não localizada."));
    }
  }, [id]);

  if (!campanha) return <div className="p-10 flex justify-center text-slate-400 font-bold">A carregar dados da campanha...</div>;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link to="/campanhas">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-white"><ChevronLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{campanha.titulo}</h1>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
              {campanha.status}
            </span>
          </div>
          <p className="text-slate-500 font-medium">Detalhes e orientações desta ação comunitária.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> Informações da Campanha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <Info className="w-5 h-5" /> Sobre a Ação
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">
              {campanha.descricao}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
              <div className="p-3 bg-white rounded-lg shadow-sm"><Users className="w-6 h-6 text-blue-500" /></div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Público-Alvo</span>
                <p className="font-bold text-slate-800 text-lg">{campanha.publicoAlvo}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
              <div className="p-3 bg-white rounded-lg shadow-sm"><Calendar className="w-6 h-6 text-orange-500" /></div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</span>
                <p className="font-bold text-slate-800 text-lg">
                  {campanha.dataInicio ? new Date(campanha.dataInicio).toLocaleDateString() : ""} até {campanha.dataFim ? new Date(campanha.dataFim).toLocaleDateString() : ""}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Users, Calendar, Target, Info, Building2, Phone, Mail, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"; // <-- IMPORT ADICIONADO PARA CORRIGIR OS ERROS 2304
import { type Campanha, campanhaService } from "../services/api";
import { toast } from "sonner";

export default function CampanhaDetalhes() {
  const { id } = useParams(); 
  const [campanha, setCampanha] = useState<Campanha | null>(null);

  useEffect(() => {
    if (id) {
      campanhaService.buscarPorId(Number(id))
        .then(setCampanha)
        .catch(() => toast.error("Campanha não localizada no ecossistema."));
    }
  }, [id]);

  if (!campanha) {
    return <div className="p-10 flex justify-center text-slate-400 font-bold">A carregar dados da campanha...</div>;
  }

  const abrirMapa = () => {
    if (campanha.localizacao) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campanha.localizacao)}`;
      window.open(url, "_blank");
    } else {
      toast.error("Nenhuma coordenada ou endereço cadastrado para esta ação.");
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500 max-w-5xl">
      {/* CABEÇALHO */}
      <div className="flex items-center gap-4">
        <Link to="/campanhas">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-white">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{campanha.titulo}</h1>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
              {campanha.status}
            </span>
            {campanha.categoria && (
              <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                {campanha.categoria}
              </span>
            )}
          </div>
          <p className="text-slate-500 font-medium">Informações detalhadas da ação de saúde pública.</p>
        </div>
      </div>

      {/* IMAGEM DE CAPA */}
      {campanha.linkimagem && (
        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
          <img 
            src={campanha.linkimagem} 
            alt={campanha.titulo} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DIRETRIZES DA CAMPANHA */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> Diretrizes e Descrição
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <Info className="w-5 h-5" /> Sobre o Evento
              </h3>
              <p className="text-slate-700 text-base leading-relaxed font-medium whitespace-pre-wrap">
                {campanha.descricao}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                <div className="p-3 bg-white rounded-lg shadow-sm"><Users className="w-6 h-6 text-blue-500" /></div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Público-Alvo</span>
                  <p className="font-bold text-slate-800">{campanha.publicoAlvo || "População Geral"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                <div className="p-3 bg-white rounded-lg shadow-sm"><Calendar className="w-6 h-6 text-orange-500" /></div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {campanha.dataInicio ? new Date(campanha.dataInicio).toLocaleDateString('pt-BR') : ""} - {campanha.dataFim ? new Date(campanha.dataFim).toLocaleDateString('pt-BR') : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* LOCALIZAÇÃO (INTERATIVA) */}
            {campanha.localizacao && (
              <div className="pt-2">
                <Button 
                  onClick={abrirMapa}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-md transition-all"
                >
                  <MapPinned className="w-5 h-5 text-emerald-400 animate-bounce" />
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-normal">Local da Ação (Toque para abrir no Maps)</p>
                    <p className="text-sm font-bold text-white truncate max-w-md">{campanha.localizacao}</p>
                  </div>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ÓRGÃO PUBLICADOR / DETALHES DE CONTATO */}
        <Card className="border-none shadow-sm h-fit">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Órgão Publicador
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div>
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição Responsável</Label>
              <p className="font-bold text-slate-800 text-base mt-0.5">
                {campanha.instituicao?.nome || "Secretaria de Saúde Coletiva"}
              </p>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold mt-1 inline-block">
                {campanha.instituicao?.tipoInstituicao || "ÓRGÃO CENTRAL"}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informações de Contato</Label>
              
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Telefone</p>
                  <p className="font-semibold text-slate-700">{campanha.instituicao?.telefone || "(11) 4034-6700"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail className="w-4 h-4" /></div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-medium">E-mail Institucional</p>
                  <p className="font-semibold text-slate-700 truncate">{campanha.instituicao?.email || "suporte.saude@conecta.gov"}</p>
                </div>
              </div>
            </div>

            {campanha.instituicao?.endereco && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede do Órgão</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{campanha.instituicao.endereco}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
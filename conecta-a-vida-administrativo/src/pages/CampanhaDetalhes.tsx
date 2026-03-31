import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Users, CheckCircle2, Calendar, Target, Download, Syringe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Campanha, campanhaService } from "../services/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

export default function CampanhaDetalhes() {
  const { id } = useParams();
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  
  // Dados simulados baseados no seu design original
  const dataMeta = [
    { name: "Atingido", value: 840, color: "#10b981" },
    { name: "Restante", value: 160, color: "#f1f5f9" },
  ];

  useEffect(() => {
    if (id) {
      campanhaService.buscarPorId(Number(id))
        .then(setCampanha)
        .catch(() => toast.error("Campanha não localizada."));
    }
  }, [id]);

  if (!campanha) return <div className="p-10 flex justify-center text-slate-400 font-bold">Carregando dados da campanha...</div>;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/campanhas">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-white"><ChevronLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{campanha.titulo}</h1>
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Fase Ativa</span>
          </div>
          <p className="text-slate-500 font-medium">Análise de cobertura vacinal e adesão do público.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" /> Planeamento e Estratégia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed font-medium">{campanha.descricao}</p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo Prioritário</span>
                <p className="font-bold text-slate-800 flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-blue-500" /> {campanha.publicoAlvo}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cronograma</span>
                <p className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-orange-500" /> {new Date(campanha.dataInicio).toLocaleDateString()} - {new Date(campanha.dataFim).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col items-center justify-center p-6 bg-white">
          <CardHeader className="p-0 mb-4 text-center">
            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Cobertura Vacinal</CardTitle>
          </CardHeader>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataMeta} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {dataMeta.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 leading-none">84%</span>
              <span className="text-[10px] font-bold text-green-600 uppercase">da Meta</span>
            </div>
          </div>
          <Button className="w-full bg-slate-900 hover:bg-black gap-2 font-bold mt-4">
            <Download className="w-4 h-4" /> Emitir Relatório PDF
          </Button>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between p-6">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600"/> Últimas Aplicações</CardTitle>
            <CardDescription>Fluxo de atendimentos em tempo real para esta campanha.</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-blue-600 leading-none">840</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Cidadãos Imunizados</div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold text-slate-600 h-12">Cidadão</TableHead>
              <TableHead className="font-bold text-slate-600">Momento da Dose</TableHead>
              <TableHead className="font-bold text-slate-600">Lote Utilizado</TableHead>
              <TableHead className="font-bold text-right text-slate-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            <TableRow className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-bold text-slate-900 py-4">Luiz Henrique Gonçalves</TableCell>
              <TableCell className="text-slate-500 font-medium">Hoje, às 14:35</TableCell>
              <TableCell><code className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-tight">CP-2026-X8</code></TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-tighter">
                  <Syringe className="w-3 h-3"/> Dose Aplicada
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
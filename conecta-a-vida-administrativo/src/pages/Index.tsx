import { useEffect, useState } from "react";
import { Users, AlertTriangle, Megaphone, Newspaper, ArrowUpRight, Activity, Loader2 } from "lucide-react";
import { dashboardService, logService, type DashboardStats, type ChartData, type LogAtividade } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    alertasAtivos: 0,
    campanhasAtivas: 0,
    noticiasPublicadas: 0
  });
  const [grafico, setGrafico] = useState<ChartData[]>([]);
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosDashboard = async () => {
      try {
        // Dispara as requisições em paralelo para máxima performance
        const [dadosStats, dadosGrafico, dadosLogs] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChartData(),
          logService.listarRecentes()
        ]);

        if (dadosStats) setStats(dadosStats);
        if (dadosGrafico) setGrafico(dadosGrafico);
        if (dadosLogs) setLogs(dadosLogs);
      } catch (error) {
        console.error("Erro ao alimentar o painel com dados reais:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* SEÇÃO DO CABEÇALHO */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral e indicadores do ecossistema Conecta à Vida.</p>
      </div>

      {/* QUADRANTE DE METRICAS (4 CARDS) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: USUÁRIOS */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Usuários Cadastrados</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.totalUsuarios}</div>
            <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-0.5">Comunidade ativa no Supabase</p>
          </CardContent>
        </Card>

        {/* CARD 2: ALERTAS ATIVOS */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Alertas Ativos</CardTitle>
            <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.alertasAtivos}</div>
            <p className="text-xs text-red-600 font-medium mt-1">Notificações críticas emitidas</p>
          </CardContent>
        </Card>

        {/* CARD 3: CAMPANHAS */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Campanhas Ativas</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Megaphone className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.campanhasAtivas}</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">Ações de saúde em andamento</p>
          </CardContent>
        </Card>

        {/* CARD 4: NOTÍCIAS */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Notícias Publicadas</CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Newspaper className="w-4 h-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.noticiasPublicadas}</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Informativos no feed do app</p>
          </CardContent>
        </Card>
      </div>

      {/* BLOCOS INFERIORES: GRÁFICO E ATIVIDADES */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* DESIGN DO GRÁFICO DE CRESCIMENTO */}
        <Card className="md:col-span-4 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Crescimento da Plataforma</CardTitle>
            <p className="text-xs text-slate-400">Evolução do volume de usuários nos últimos meses</p>
          </CardHeader>
          <CardContent className="h-[240px] flex items-end justify-between gap-2 pt-4">
            {grafico.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Barra do gráfico proporcional */}
                <div 
                  className="w-full bg-blue-600/90 rounded-t-md group-hover:bg-blue-600 transition-all duration-300 relative"
                  style={{ height: `${Math.max((item.quantidade / (stats.totalUsuarios || 1)) * 180, 15)}px` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 px-1 rounded">
                    {item.quantidade}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">{item.mes}</span>
              </div>
            ))}
            {grafico.length === 0 && (
              <div className="w-full text-center text-sm text-slate-400 italic pb-20">
                Nenhum fluxo de novos usuários registrado.
              </div>
            )}
          </CardContent>
        </Card>

        {/* LISTA DE ATIVIDADE RECENTE */}
        <Card className="md:col-span-3 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Atividade Recente</CardTitle>
              <p className="text-xs text-slate-400">Logs de ações recentes executadas</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-none last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{log.usuario?.nome || "Sistema"}</p>
                    <p className="text-xs text-slate-500 leading-tight">{log.acao}</p>
                    <p className="text-[10px] text-slate-400">{new Date(log.dataHora).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-400 italic">
                  Sem atividades recentes.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Syringe, 
  History,
  TrendingUp,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { 
  type LogAtividade, 
  type DashboardStats, 
  type ChartData,
  logService, 
  dashboardService 
} from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function Index() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca todas as informações em paralelo da API Java
        const [resStats, resChart, resLogs] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChartData(),
          logService.listarRecentes()
        ]);

        setStats(resStats);
        setChartData(resChart);
        setLogs(resLogs);
      } catch (error) {
        toast.error("Erro ao sincronizar dados com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const s = stats || { totalPacientes: 0, vacinasAplicadas: 0, alertasAtivos: 0, agendamentosHoje: 0 };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Administrativa</h1>
        <p className="text-slate-500 font-medium">Resumo em tempo real da unidade de saúde.</p>
      </div>

      {/* Cards de Métricas Reais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Pacientes Totais" 
          value={loading ? "..." : s.totalPacientes} 
          trend="+4%" 
          up={true} 
          icon={<Users className="w-5 h-5 text-blue-600"/>} 
        />
        <StatCard 
          title="Vacinas Aplicadas" 
          value={loading ? "..." : s.vacinasAplicadas.toLocaleString('pt-BR')} 
          trend="+12%" 
          up={true} 
          icon={<Syringe className="w-5 h-5 text-purple-600"/>} 
        />
        <StatCard 
          title="Alertas Ativos" 
          value={loading ? "..." : String(s.alertasAtivos).padStart(2, '0')} 
          trend="-1" 
          up={false} 
          icon={<Bell className="w-5 h-5 text-red-600"/>} 
        />
        <StatCard 
          title="Agendamentos" 
          value={loading ? "..." : `+${s.agendamentosHoje}`} 
          trend="+18%" 
          up={true} 
          icon={<Calendar className="w-5 h-5 text-green-600"/>} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Fluxo de Imunização
            </CardTitle>
            <CardDescription>Doses aplicadas nos últimos meses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="quantidade" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorQty)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">
                {loading ? "A carregar dados..." : "Nenhuma vacina registada para o gráfico."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="w-5 h-5 text-blue-600"/> Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                    {log.usuario[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{log.usuario}</p>
                    <p className="text-xs text-slate-500">{log.acao}</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">
                    {formatDistanceToNow(new Date(log.dataHora), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              )) : <p className="text-center text-slate-400 py-10">Sem atividades recentes.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, up, icon }: { title: string, value: any, trend: string, up: boolean, icon: any }) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <p className={`text-xs font-bold flex items-center gap-1 mt-1 ${up ? 'text-green-600' : 'text-red-600'}`}>
          {trend} <span className="text-slate-400 font-normal">vs. mês passado</span>
        </p>
      </CardContent>
    </Card>
  );
}